import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Model } from 'mongoose';
import { CreditScore } from 'src/models/credit-score.model';
import { UsersService } from '../users/users.service';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { ZeehService } from '../zeeh/zeeh.service';
import { Loan } from 'src/models/loan.model';
import { Hospital } from 'src/models/hospital.model';
import { CreditRequest } from 'src/models/credit-request.model';
import { Bill } from 'src/models/bill.model';

@Injectable()
export class CreditScoreService {
  constructor(
    @InjectModel(CreditScore.name)
    private readonly creditScoreModel: Model<CreditScore>,
    @InjectModel(Loan.name) private readonly loanModel: Model<Loan>,
    @InjectModel(CreditRequest.name)
    private readonly creditRequestModel: Model<CreditRequest>,
    @InjectModel(Bill.name) private readonly billModel: Model<Bill>,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
    private readonly zeehService: ZeehService,
  ) {}

  async getCreditScore(userId: string): Promise<IServiceResponse> {
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) throw new NotFoundException('User not found');
      const bvn = user.data.bvn;

      const scoresData = await this.zeehService.getCreditScore(bvn);

      if (typeof scoresData === 'object') {
        const updatedCreditScore = await this.saveOrUpdateCreditScore(
          user.data._id,
          bvn,
          scoresData,
        );

        const repaymentHistory = await this.getUserRepaymentHistory(userId);
        const loanFrequency = await this.getUserLoanFrequency(userId);
        const billAmount = await this.getUserBillAmount(userId);

        const externalScore = parseInt(
          scoresData?.score?.totalConsumerScore || '0',
          10,
        );

        const prediction = await this.runMlPrediction({
          externalScore,
          repaymentHistory,
          loanFrequency,
          billAmount,
        });

        return {
          data: {
            creditScore: updatedCreditScore,
            prediction,
          },
        };
      }

      return {
        data: null,
        message: 'Invalid credit score data received',
      };
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async runMlPrediction(features: {
    externalScore: number;
    repaymentHistory: number;
    loanFrequency: number;
    billAmount: number;
  }): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://127.0.0.1:8000/predict', features),
      );
      return response.data.prediction;
    } catch (error) {
      console.error('Prediction error:', error.message);
      throw new HttpException('Failed to fetch prediction from ML API', 500);
    }
  }

  private async getUserRepaymentHistory(userId: string): Promise<number> {
    const totalLoans = await this.loanModel.countDocuments({ userId });
    const completedLoans = await this.loanModel.countDocuments({
      userId,
      status: 'completed',
    });
    return totalLoans > 0 ? (completedLoans / totalLoans) * 100 : 0;
  }

  private async getUserLoanFrequency(userId: string): Promise<number> {
    const loans = await this.loanModel.countDocuments({ userId });
    return loans;
  }

  private async getUserBillAmount(userId: string): Promise<number> {
    const creditRequest = await this.creditRequestModel
      .findOne({ userId })
      .sort({ createdAt: -1 })
      .exec();

    if (!creditRequest || !creditRequest.billId) {
      throw new NotFoundException('No credit request or billId found for user');
    }

    const bill = await this.billModel.findById(creditRequest.billId).exec();

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    return bill.totalAmount;
  }

  async saveOrUpdateCreditScore(
    userId: string,
    bvn: string,
    creditScoreData: any,
  ): Promise<CreditScore> {
    try {
      return await this.creditScoreModel
        .findOneAndUpdate(
          { userId, bvn },
          { data: creditScoreData },
          { new: true, upsert: true },
        )
        .populate('userId', 'firstName lastName email');
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
