import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type PaystackDocument = Paystack & HydratedDocument<Paystack>;

@Schema({ timestamps: true })
export class Paystack {
  @Prop({ type: Object })
  payload: object;
}

export const PaystackSchema = SchemaFactory.createForClass(Paystack);
