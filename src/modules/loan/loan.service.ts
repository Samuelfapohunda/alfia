import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditScore } from 'src/models/credit-score.model';
import { UsersService } from '../users/users.service';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { ZeehService } from '../zeeh/zeeh.service';
import { Loan } from 'src/models/loan.model';
import { CreateLoanDto } from 'src/common/dto/loan.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectModel(Loan.name) private readonly loanModel: Model<Loan>,
  ) {}

  async create(createLoanDto: CreateLoanDto): Promise<IServiceResponse> {
    try {
      let createdLoan = new this.loanModel(createLoanDto);
      createdLoan = await createdLoan.save();

      return {
        data: createdLoan,
        message: 'Loan created successfully',
      };
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getLoanById(loanId: string): Promise<IServiceResponse> {
    try {
      const loan = await this.loanModel.findById(loanId).exec();
      return {
        data: loan,
      };
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllLoans(userId?: string): Promise<IServiceResponse> {
    try {
      const query: any = userId ? { userId } : {};
      const loan = await this.loanModel
        .find(query)
        .populate('userId', 'firstName lastName email imageUrl bvn mcaNumber')
        .sort({ createdAt: -1 })
        .exec();

      return {
        data: loan,
      };
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
