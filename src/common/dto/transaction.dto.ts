import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateTransactionDto {
  @ApiProperty() @IsOptional() @IsMongoId() userId?: string;
  @ApiProperty() @IsOptional() @IsMongoId() adminId?: string;
  @ApiProperty() @IsNotEmpty() @IsString() description: string;
  @ApiProperty() @IsOptional() @IsString() reference?: string;
  @ApiProperty() @IsNotEmpty() @IsNumber() @IsPositive() amount: number;
  @ApiProperty() @IsNotEmpty() @IsString() status: string;
  @ApiProperty() @IsNotEmpty() @IsString() type: string;
  @ApiProperty() @IsNotEmpty() @IsString() paymentType: string;
}
export class UpdateTransactionDto {
  @ApiProperty() @IsOptional() @IsMongoId() userId?: string;
  @ApiProperty() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsOptional() @IsString() reference?: string;
  @ApiProperty() @IsOptional() @IsNumber() @IsPositive() amount?: number;
  @ApiProperty() @IsOptional() @IsString() status?: string;
  @ApiProperty() @IsOptional() @IsString() type?: string;
  @ApiProperty() @IsOptional() @IsString() paymentType?: string;
}
