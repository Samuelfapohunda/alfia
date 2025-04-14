import {
    IsDateString,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  import { CreditRequestFrequencyEnum } from '../enums/credit-request.enum';
  
  export class CreateCreditRequestDto {
    @ApiProperty() @IsNotEmpty()
    @IsIn([
      CreditRequestFrequencyEnum.Daily,
      CreditRequestFrequencyEnum.Weekly,
      CreditRequestFrequencyEnum.Monthly,
    ])
    frequency: CreditRequestFrequencyEnum;
    @ApiProperty() @IsNotEmpty() @IsNumber() @IsPositive() duration: number;
    @ApiProperty() @IsNotEmpty() @IsDateString() startDate: Date;
  }
  
  export class UpdateCreditRequestDto extends CreateCreditRequestDto {}
  