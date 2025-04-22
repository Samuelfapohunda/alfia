import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Payment } from 'src/models/payment.model';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePaymentDto } from 'src/common/dto/payment.dto';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
  ) {}

  async savePayment(createPaymentDto: CreatePaymentDto): Promise<void> {
    try {
      const data = new this.paymentModel(createPaymentDto);
      await data.save();
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async isReferenceDuplicated(reference: string): Promise<boolean> {
    try {
      const payment = await this.findByReference(reference);
      if (payment) return true;
      return false;
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: ObjectId): Promise<IServiceResponse> {
    const payment= await this.paymentModel.findById(id).exec();
    return {
        data: payment,
    }
  }

  async findByReference(reference: string): Promise<IServiceResponse> {
    const payment = await this.paymentModel.findOne({ reference }).exec();

    return {
        data: payment,
    }
  }
}
