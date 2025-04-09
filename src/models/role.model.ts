import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type RoleDocument = Role & HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
