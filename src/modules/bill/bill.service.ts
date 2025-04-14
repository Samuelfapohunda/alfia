import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBillDto } from 'src/common/dto/bill.dto';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { Bill } from 'src/models/bill.model';
import { HospitalService } from '../hospital/hospital.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BillService {
  constructor(
    @InjectModel(Bill.name) private billModel: Model<Bill>,
    private readonly hospitalService: HospitalService,
    private readonly userSevice: UsersService,
  ) {}

  async createBill(
    hospitalId: string,
    userId: string,
    dto: CreateBillDto,
  ): Promise<IServiceResponse> {
    const totalAmount = dto.services.reduce((sum, item) => sum + item.cost, 0);

    const hospital = await this.hospitalService.findHospitalById(hospitalId);
    const user = await this.userSevice.getUserById(userId);

    const bill = await this.billModel.create({
      hospitalId: hospital.data._id,
      userId: user.data._id,
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
      throw new NotFoundException('Bill not found');
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
      .findByIdAndUpdate(billId, { status }, { new: true })
      .populate('hospitalId', 'name')
      .populate('userId', 'name')
      .exec();

    if (!updatedBill) {
      throw new NotFoundException('Bill not found');
    }

    return {
      data: updatedBill,
    };
  }

  async deleteBill(billId: string): Promise<IServiceResponse> {
    const bill = await this.billModel.findById(billId);

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    await this.billModel.findByIdAndDelete(billId);

    return {
      data: {
        message: 'Bill deleted successfully',
      },
    };
  }
  async getBillsByUserId(userId: string): Promise<IServiceResponse> {
    const bills = await this.billModel
      .find({ userId: userId })
      .populate('hospitalId', 'name')
      .populate('userId', 'name')
      .exec();

      const user = await this.userSevice.getUserById(userId);
    if (!user) {
        throw new NotFoundException('User not found');
        }

    return {
      data: bills,
    };
  }
}
