import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Gender } from 'src/common/enums/gender.enum';

export type UserDocument = User & HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ enum: Gender, required: true })
  gender: Gender;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  bvn: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: 0 })
  failedLoginAttempt: number;

  @Prop()
  lockUntil: Date;

  @Prop()
  walletBalance: number;

  @Prop({ default: 0 })
  loginCount: number;

  @Prop({default: null})
  lastLogin: Date;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiration?: Date;

  @Prop({ select: false })
  refreshToken?: string;

  @Prop()
  resetPasswordToken: string;

  @Prop({default: null})
  resetPasswordExpires: Date ;
}

export const UserSchema = SchemaFactory.createForClass(User);
