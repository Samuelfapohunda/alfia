import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  CreditRequestFrequencyEnum,
  CreditRequestStatus,
} from 'src/common/enums/credit-request.enum';

export type CreditRequestDocument = CreditRequest &
  HydratedDocument<CreditRequest>;

@Schema({ timestamps: true })
export class CreditRequest {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true })
  billId: string;

  @Prop({ required: true })
  amountRequested: number;

  @Prop({ required: true })
  frequency: CreditRequestFrequencyEnum;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  nextRepaymentDate: Date;

  @Prop({ required: true })
  duration: number;

  @Prop()
  amountApproved: number;

  @Prop()
  interestPercentage: number;

  @Prop({ default: CreditRequestStatus.Pending })
  status: CreditRequestStatus;

  @Prop()
  loanRepaymentAmount: number;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isSuspicious: boolean;

  @Prop({ type: [String], default: [] })
  suspicionReasons: string[];
}

export const CreditRequestSchema = SchemaFactory.createForClass(CreditRequest);
