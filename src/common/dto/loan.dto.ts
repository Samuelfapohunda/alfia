import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RepaymentStatus } from '../enums/loan.enum';

export class CreateLoanDto {
  @ApiProperty() @IsNotEmpty() @IsMongoId() creditRequestId: string;
  @ApiProperty() @IsNotEmpty() @IsMongoId() userId: string;
  @ApiProperty() @IsNotEmpty() @IsNumber() @IsPositive() amountGiven: number;
  @ApiProperty() @IsNotEmpty() @IsString() amountToPay: number;
  @ApiProperty() @IsNotEmpty() @IsString() description: string;
  @ApiProperty() @IsNotEmpty() @IsNumber() @IsPositive() duration: number;
  @ApiProperty() @IsNotEmpty() @IsString() frequency: string;
  @ApiProperty() @IsNotEmpty() @IsDateString() startDate: Date;
  @ApiProperty() @IsNotEmpty() @IsDateString() nextRepaymentDate: Date;
  @ApiProperty() @IsNotEmpty() @IsDateString() endDate: Date;
  @ApiProperty() @IsOptional() @IsString() repaymentStatus: RepaymentStatus;
}
