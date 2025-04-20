import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Helpers } from 'src/common/helpers';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { CreateTransactionDto } from 'src/common/dto/transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from 'src/models/transaction.model';
import { User } from 'src/models/user.model';
import { TransactionStatus, TransactionTypeEnum } from 'src/common/enums/transaction.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<IServiceResponse> {
    try {
      const reference = createTransactionDto.reference
        ? createTransactionDto.reference
        : Helpers.generateReference();

      const transaction = new this.transactionModel({
        ...createTransactionDto,
        reference: reference,
      });
      await transaction.save();
    return {
        data: transaction,
    }
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: string): Promise<IServiceResponse> {
    try {
      const transaction = await this.transactionModel.findById(id).exec();

      return {
        data: transaction,
      }
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByReference(
    userId: string,
    reference: string,
  ): Promise<IServiceResponse> {
    try {
      const transaction = await this.transactionModel.findOne({ userId, reference }).exec();
        if (!transaction) throw new NotFoundException('Transaction not found');
        return {
        data: transaction,
        };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(
    userId: string,
    skip: number,
    limit: number,
    search?: string,
    status?: TransactionStatus,
  ): Promise<IServiceResponse> {
    try {
      const query = this.searchQuery(userId, search, status);

      const transaction = await this.transactionModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

        return{
            data: transaction,
        }
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async countAll(
    userId: string,
    search?: string,
    status?: TransactionStatus,
  ): Promise<number> {
    try {
      const query = this.searchQuery(userId, search, status);
      return await this.transactionModel.countDocuments(query).exec();
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private searchQuery(
    userId: string,
    search?: string,
    status?: TransactionStatus,
  ): object {
    const regexSearch = new RegExp(search || '', 'i');
    const query: any = { userId };
    if (status) query.status = status;

    return {
      $and: [
        query,
        { $or: [{ status: regexSearch }, { description: regexSearch }] },
      ],
    };
  }

//   async findDebitAndCreditBalance(userId: string): Promise<any> {
//     try {
//       const transactions = await this.transactionModel
//         .find({
//           userId,
//           type: {
//             $in: [TransactionTypeEnum.Credit, TransactionTypeEnum.Debit],
//           },
//         })
//         .lean();

//       let totalAmountCredited = 0;
//       let totalAmountDebited = 0;

//       transactions.forEach((transaction) => {
//         if (transaction.type === TransactionTypeEnum.Credit) {
//           totalAmountCredited += transaction.amount || 0;
//         } else if (transaction.type === TransactionTypeEnum.Debit) {
//           totalAmountDebited += transaction.amount || 0;
//         }
//       });

//       return { totalAmountDebited, totalAmountCredited };
//     } catch (ex) {
//       throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

}
