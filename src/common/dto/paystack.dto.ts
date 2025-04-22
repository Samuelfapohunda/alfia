import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty() @IsNumber() @IsPositive() amount: number;
}
