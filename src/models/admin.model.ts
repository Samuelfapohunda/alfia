import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { Role } from './role.model';

export type AdminDocument = Admin & HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  })
  role: ObjectId;

  @Prop()
  name: string;

  @Prop()
  phoneNumber: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: 0 })
  failedLoginAttempt: number;

  @Prop({default: null})
  lockUntil: Date;

  @Prop({ default: 0 })
  loginCount: number;

  @Prop({ default: null })
  lastLogin: Date;

  @Prop()
  activityCount: number;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isPasswordChanged: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isSuperAdmin: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  otp?: string;

  @Prop()
  otpExpiration?: Date;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetPasswordExpires: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
