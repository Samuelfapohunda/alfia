import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as MongooseSchema } from 'mongoose';


export type BillDocument = Bill & HydratedDocument<Bill>;


@Schema({ timestamps: true })
export class Bill {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Hospital', required: true })
  hospitalId:string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        cost: { type: Number, required: true },
      },
    ],
    required: true,
  })
  services: {
    name: string;
    cost: number;
  }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'pending' })
  status: 'pending' | 'paid' | 'cancelled';

  @Prop({ default: false })
  isDeleted: boolean;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
