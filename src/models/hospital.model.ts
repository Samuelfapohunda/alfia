import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';
import { Admin } from './admin.model';

export type HospitalDocument = Hospital & HydratedDocument<Hospital>;

@Schema({ timestamps: true })
export class Hospital {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  })
  approvedBy: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({default: false})
  isPasswordChanged: boolean;

  @Prop()
  CACDocumentURL: string;

  @Prop({ required: true })
  registrationNumber: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  accountName: string;

  @Prop({ required: true })
  bankName: string;

  @Prop()
  walletBalance: number;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const HospitalSchema = SchemaFactory.createForClass(Hospital);
