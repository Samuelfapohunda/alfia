import {
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
  } from 'class-validator';
  import { ObjectId } from 'mongoose';
  
  export class CreatePaymentDto {
    @IsNotEmpty() @IsNumber() @IsPositive() amount: number;
    @IsNotEmpty() @IsString() reference: string;
    @IsNotEmpty() paymentGatewayResponse: object;
    @IsOptional() @IsString() userId?: string;
    @IsOptional() @IsString() adminId?: string;
  }
  