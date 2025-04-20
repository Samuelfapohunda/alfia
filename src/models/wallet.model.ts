import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type WalletDocument = Wallet & HydratedDocument<Wallet>;

@Schema({ timestamps: true })
export class Wallet {
  @Prop()
  amount: number;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: true })
  isDefault: boolean;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
