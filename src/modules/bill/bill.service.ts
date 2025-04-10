import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBillDto } from 'src/common/dto/bill.dto';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { Bill } from 'src/models/bill.model';

@Injectable()
export class BillService {
  constructor(@InjectModel(Bill.name) private billModel: Model<Bill>) {}

  async createBill(
    hospitalId: string,
    userId: string,
    dto: CreateBillDto,
  ): Promise<IServiceResponse> {
    const totalAmount = dto.services.reduce((sum, item) => sum + item.cost, 0);

    const bill = await this.billModel.create({
      hospitalId,
      userId,
      services: dto.services,
      totalAmount,
      status: 'pending',
    });

    return {
      data: bill,
    };
  }


  async getAllBills(): Promise<IServiceResponse> {
    const bills = await this.billModel
      .find()
      .populate('hospitalId', 'name')
      .populate('userId', 'name')
      .exec();

    return {
      data: bills,
    };
  }

    async getBillById(billId: string): Promise<IServiceResponse> {
        const bill = await this.billModel
        .findById(billId)
        .populate('hospitalId', 'name')
        .populate('userId', 'name')
        .exec();
    
        if (!bill) {
        throw new Error('Bill not found');
        }
    
        return {
        data: bill,
        };
    }

    async updateBillStatus(
        billId: string,
        status: string,
    ): Promise<IServiceResponse> {
        const updatedBill = await this.billModel
        .findByIdAndUpdate(
            billId,
            { status },
            { new: true },
        )
        .populate('hospitalId', 'name')
        .populate('userId', 'name')
        .exec();
    
        if (!updatedBill) {
        throw new Error('Bill not found');
        }
    
        return {
        data: updatedBill,
        };
    }
   
}
