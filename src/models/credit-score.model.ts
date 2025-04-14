import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CreditScoreDocument = CreditScore & HydratedDocument<CreditScore>;

@Schema({ timestamps: true })
export class CreditScore {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop()
  bvn: string;

  @Prop({type: Object})
  data: object;
}

export const CreditScoreSchema = SchemaFactory.createForClass(CreditScore);
