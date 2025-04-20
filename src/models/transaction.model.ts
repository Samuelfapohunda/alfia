import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TransactionStatus } from 'src/common/enums/transaction.enum';

export type TransactionDocument = Transaction & HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' })
  adminId: string;

  @Prop()
  reference: string;

  @Prop()
  description: string;

  @Prop()
  type: string;
 
  @Prop()
  paymentType: string;

  @Prop()
  status: TransactionStatus;

  @Prop()
  amount: number;
  
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
