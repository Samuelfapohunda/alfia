import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateCreditRequestDto,
  UpdateCreditRequestDto,
} from 'src/common/dto/credit-request.dto';
import { CreditRequestStatus } from 'src/common/enums/credit-request.enum';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { CreditRequest } from 'src/models/credit-request.model';
import { BillService } from '../bill/bill.service';
import { Bill } from 'src/models/bill.model';
import { CreditScoreService } from '../credit-score/credit-score.service';
import { LoanService } from '../loan/loan.service';
import { RepaymentStatus } from 'src/common/enums/loan.enum';
import { WalletService } from '../wallet/wallet.service';
import { TransactionService } from '../transaction/transaction.service';
import { Hospital } from 'src/models/hospital.model';
import {
  TransactionPaymentTypeEnum,
  TransactionStatus,
  TransactionTypeEnum,
} from 'src/common/enums/transaction.enum';
import { Helpers } from 'src/common/helpers';
import { Loan } from 'src/models/loan.model';
import { Admin } from 'src/models/admin.model';
import { FraudDetectionService } from './fraud-detection.service';

@Injectable()
export class CreditRequestService {
  constructor(
    @InjectModel(CreditRequest.name)
    private readonly creditRequestModel: Model<CreditRequest>,
    @InjectModel(Bill.name) private readonly billModel: Model<Bill>,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectModel(Hospital.name) private readonly hospitalModel: Model<Hospital>,
    @InjectModel(Loan.name) private readonly loanModel: Model<Loan>,
    private readonly creditScoreService: CreditScoreService,
    private readonly loanService: LoanService,
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService,
    private readonly fraudDetectionService: FraudDetectionService,
  ) {}

  async create(
    billId: string,
    createCreditRequestDto: CreateCreditRequestDto,
  ): Promise<IServiceResponse> {
    try {
      const bill = await this.billModel.findById(billId);
      if (!bill) {
        throw new NotFoundException('Bill not found');
      }

      const userId = bill.userId;

      const existingLoan = await this.loanModel.findOne({
        userId,
        repaymentStatus: RepaymentStatus.InProgress,
      });
      if (existingLoan) {
        throw new HttpException(
          'User has an active loan.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const nextRepaymentDate = Helpers.calculateNextRepaymentDate(
        createCreditRequestDto.startDate,
        createCreditRequestDto.frequency,
      );

      const endDate = Helpers.calculateEndDate(
        createCreditRequestDto.startDate,
        createCreditRequestDto.frequency,
        createCreditRequestDto.duration,
      );

      // const pendingCreditRequest = await this.creditRequestModel.findOne({
      //   billId,
      //   userId,
      //   status: CreditRequestStatus.Pending,
      // });

      // if (pendingCreditRequest) {
      //   throw new HttpException(
      //     'User has a pending credit request.',
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }

      const newCreditRequest = await this.creditRequestModel.create({
        billId,
        userId,
        amountRequested: bill.totalAmount,
        interestPercentage: 3,
        frequency: createCreditRequestDto.frequency,
        nextRepaymentDate: nextRepaymentDate,
        endDate: endDate,
        startDate: createCreditRequestDto.startDate,
        duration: createCreditRequestDto.duration,
      });


      
      const suspicionReasons = await this.fraudDetectionService.detectFraud(
        billId,
        userId,
      );

      if (suspicionReasons.length > 0) {
        newCreditRequest.isSuspicious = true;
        newCreditRequest.suspicionReasons = suspicionReasons;
        await newCreditRequest.save();
      }

      return {
        data: newCreditRequest,
      };
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async processCreditRequest(
    creditRequestId: string,
    adminId: string,
  ): Promise<IServiceResponse> {
    try {
      const admin = await this.adminModel.findById(adminId);

      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      const creditRequest = await this.creditRequestModel
        .findById(creditRequestId)
        .populate('billId')
        .exec();

      if (!creditRequest) {
        throw new NotFoundException('Credit request not found');
      }

      if (creditRequest.status !== CreditRequestStatus.Pending) {
        throw new HttpException(
          'Credit request has already been processed',
          HttpStatus.BAD_REQUEST,
        );
      }

      const bill: any = creditRequest.billId;
      const userId = bill.userId;
      const hospitalId = bill.hospitalId;

      const creditScoreResult =
        await this.creditScoreService.getCreditScore(userId);
      const prediction = creditScoreResult?.data?.prediction;
      const creditScore = creditScoreResult?.data?.creditScore;
      const billAmount = bill.totalAmount;

      if (prediction === 1) {
        const newLoan = await this.loanService.create({
          userId,
          creditRequestId,
          amountGiven: billAmount,
          amountToPay: billAmount,
          duration: creditRequest.duration,
          startDate: creditRequest.startDate,
          frequency: creditRequest.frequency,
          endDate: creditRequest.endDate,
          nextRepaymentDate: creditRequest.nextRepaymentDate,
          repaymentStatus: RepaymentStatus.InProgress,
        });

        creditRequest.status = CreditRequestStatus.Approved;
        creditRequest.amountApproved = billAmount;
        bill.status = 'paid';
        await bill.save();

        const interest = (billAmount * creditRequest.interestPercentage) / 100;

        creditRequest.loanRepaymentAmount =
          creditRequest.amountApproved + interest;
        await creditRequest.save();

        await this.walletService.debitWallet(billAmount);

        await this.hospitalModel.findByIdAndUpdate(
          hospitalId,
          { $inc: { walletBalance: billAmount } },
          { new: true },
        );

        await this.transactionService.create({
          reference: Helpers.generateReference(),
          amount: billAmount,
          description: `System wallet debited for hospital funding (Bill ID: ${bill._id})`,
          status: TransactionStatus.SUCCESSFUL,
          paymentType: TransactionPaymentTypeEnum.Wallet,
          type: TransactionTypeEnum.Debit,
        });

        await this.transactionService.create({
          reference: Helpers.generateReference(),
          amount: billAmount,
          description: `Hospital wallet credited for user bill (Bill ID: ${bill._id})`,
          status: TransactionStatus.SUCCESSFUL,
          paymentType: TransactionPaymentTypeEnum.Wallet,
          type: TransactionTypeEnum.Credit,
          hospitalId: hospitalId,
        });

        return {
          data: {
            message: 'Credit request approved',
            prediction,
            creditScore,
            loan: newLoan,
          },
        };
      } else {
        creditRequest.status = CreditRequestStatus.Denied;
        await creditRequest.save();
        bill.status = 'cancelled';
        await bill.save();

        return {
          data: {
            message: 'Credit request rejected due to low score',
            prediction,
            creditScore,
          },
        };
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Error processing credit request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<IServiceResponse> {
    try {
      const creditRequest = await this.creditRequestModel.findById(id).exec();

      if (!creditRequest)
        throw new NotFoundException('Credit Request not found');

      return {
        data: creditRequest,
      };
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(
    skip: number,
    limit: number,
    status?: CreditRequestStatus,
    search?: string,
    userId?: string,
  ): Promise<IServiceResponse> {
    const query = this.searchQuery(status, search, userId);
    const creditRequest = await this.creditRequestModel
      .find(query)
      .populate({
        path: 'billId',
        populate: [
          { path: 'userId', select: 'firstName lastName email' },
          { path: 'hospitalId', select: 'name email phoneNumber' },
        ],
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return {
      data: creditRequest,
    };
  }

  async countAll(
    status?: CreditRequestStatus,
    search?: string,
    userId?: string,
  ): Promise<number> {
    const query = this.searchQuery(status, search, userId);
    return await this.creditRequestModel.countDocuments(query).exec();
  }
  private searchQuery(
    status?: CreditRequestStatus,
    search?: string,
    userId?: string,
  ): object {
    const regexSearch = new RegExp(search || '', 'i');
    const query: any = userId
      ? { userId, isDeleted: false }
      : { isDeleted: false };

    if (status) {
      query.status = status;
    }

    if (search) {
      return {
        $and: [
          query,
          {
            $or: [{ status: regexSearch }],
          },
        ],
      };
    }

    return query;
  }

  async updateCreditRequest(
    id: string,
    updateCreditRequestDto: UpdateCreditRequestDto,
  ): Promise<IServiceResponse> {
    try {
      const creditRequest = await this.creditRequestModel.findByIdAndUpdate(
        id,
        updateCreditRequestDto,
        { new: true, useFindAndModify: false },
      );
      return {
        data: creditRequest,
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.creditRequestModel.findByIdAndUpdate(
        { _id: id },
        { $set: { isDeleted: true } },
        { new: true, useFindAndModify: false },
      );
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserCreditRequests(userId: string): Promise<IServiceResponse> {
    const requests = await this.creditRequestModel
      .find({ userId })
      .populate({
        path: 'billId',
        populate: [{ path: 'hospitalId', select: 'name email phoneNumber' }],
      })
      .exec();

    return { data: requests };
  }
}
