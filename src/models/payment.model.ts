import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PaymentDocument = Payment & HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop()
  amount: number;

  @Prop()
  reference: string;

  @Prop({ type: Object })
  paymentGatewayResponse: object;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  adminId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
