import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCreditRequestDto, UpdateCreditRequestDto } from 'src/common/dto/credit-request.dto';
import { CreditRequestStatus } from 'src/common/enums/credit-request.enum';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { CreditRequest } from 'src/models/credit-request.model';
import { BillService } from '../bill/bill.service';
import { Bill } from 'src/models/bill.model';


@Injectable()
export class CreditRequestService {
constructor (
    @InjectModel(CreditRequest.name) private readonly creditRequestModel: Model<CreditRequest>,
    @InjectModel(Bill.name) private readonly billModel: Model<Bill>,

  
) {}



async create(
    billId: string,
    createCreditRequestDto: CreateCreditRequestDto,
  ): Promise<IServiceResponse> {
    try {
    //   const existingLoan = await this.loanModel.findOne({
    //     userId,
    //     repaymentStatus: RepaymentStatus.InProgress,
    //   });

    const bill = await this.billModel.findById(billId);
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    const userId = bill.userId;


      const pendingCreditRequest = await this.creditRequestModel.findOne({
        billId,
        userId,
        status: CreditRequestStatus.Pending,
      });
    //   if (existingLoan) {
    //     throw new HttpException(
    //       'User has an active loan.',
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }

      if (pendingCreditRequest) {
        throw new HttpException(
          'User has a pending credit request.',
          HttpStatus.BAD_REQUEST,
        );
      }

       const newCreditRequest = await this.creditRequestModel.create({
      billId,
      userId,
      amountRequested: bill.totalAmount,
      frequency: createCreditRequestDto.frequency,
      startDate: createCreditRequestDto.startDate,
      duration: createCreditRequestDto.duration,
    });
 
      return {
        data: newCreditRequest
      };
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  
  // async processCreditRequest(
  //   creditRequestId: string,
  //   adminId: string,
  //   status: CreditRequestStatus,
  // ): Promise<CreditRequest> {
  //   try {
  //     const creditRequest =
  //       await this.creditRequestModel.findById(creditRequestId);

  //     if (!creditRequest)
  //       throw new NotFoundException('Credit request not found');

  //     const updateData: any = { status };
  //     if (
  //       status === CreditRequestStatus.Approved &&
  //       amountToBeGiven !== undefined
  //     ) {
  //       const interest =
  //         (amountToBeGiven * creditRequest.interestPercentage) / 100;

  //       updateData.amountApproved = amountToBeGiven;
  //       updateData.loanRepaymentAmount = amountToBeGiven + interest;
  //     }

  //     const updatedCreditRequest =
  //       await this.creditRequestModel.findByIdAndUpdate(
  //         creditRequestId,
  //         { $set: updateData },
  //         { new: true },
  //       );

  //     if (updatedCreditRequest.status === CreditRequestStatus.Approved) {
  //       await this.createLoan(updatedCreditRequest, adminId);
  //     } else if (updatedCreditRequest.status === CreditRequestStatus.Denied) {
  //       await this.creditRequestDeclineAction(updatedCreditRequest, adminId);
  //     }

  //     return updatedCreditRequest;
  //   } catch (ex) {
  //     throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }


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
         data: creditRequest
      }
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
            $or: [
              { status: regexSearch },
            ],
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
    const requests = await this.creditRequestModel.find({ userId })
      .populate({
        path: 'billId',
        populate: [
          { path: 'hospitalId', select: 'name email phoneNumber' },
        ],
      })
      .exec();
  
    return { data: requests };
  }




}



