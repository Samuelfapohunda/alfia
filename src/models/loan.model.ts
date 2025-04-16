import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CreditRequestFrequencyEnum } from 'src/common/enums/credit-request.enum';
import { RepaymentStatus } from 'src/common/enums/loan.enum';

export type LoanDocument = Loan & HydratedDocument<Loan>;

@Schema({ timestamps: true })
export class Loan {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CreditRequest', required: true })
  creditRequestId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop()
  duration: number;

  @Prop()
  amountGiven: number;

  @Prop()
  amountPaid: number;

  @Prop()
  percentCompleted: number;

  @Prop()
  amountLeft: number;

  @Prop()
  frequency: CreditRequestFrequencyEnum;

  @Prop()
  startDate: Date;

  @Prop()
  startRepaymentDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  lastRepaymentDate: Date;

  @Prop({default: false})
  isDeleted: boolean;

  @Prop()
  repaymentStatus: RepaymentStatus;
}

export const LoanSchema = SchemaFactory.createForClass(Loan);
