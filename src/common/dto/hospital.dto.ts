import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHospitalDto {
  @IsNotEmpty() @IsString() @ApiProperty() name: string;
  @IsNotEmpty() @IsString() @ApiProperty() email: string;
  @IsNotEmpty() @IsString() @ApiProperty() address: string;
  @IsNotEmpty() @IsString() @ApiProperty() registrationNumber: string;
  @IsNotEmpty() @IsString() @ApiProperty() phoneNumber: string;
  @IsNotEmpty() @IsString() @ApiProperty() accountNumber: string;
  @IsNotEmpty() @IsString() @ApiProperty() accountName: string;
  @IsNotEmpty() @IsString() @ApiProperty() bankName: string;
}
 

export class UpdateHospitalDto {
  @IsNotEmpty() @IsString() @ApiProperty() name: string;
  @IsNotEmpty() @IsString() @ApiProperty() email: string;
  @IsNotEmpty() @IsString() @ApiProperty() address: string;
  @IsNotEmpty() @IsString() @ApiProperty() registrationNumber: string;
  @IsNotEmpty() @IsString() @ApiProperty() phoneNumber: string;
  @IsNotEmpty() @IsString() @ApiProperty() accountNumber: string;
  @IsNotEmpty() @IsString() @ApiProperty() accountName: string;
  @IsNotEmpty() @IsString() @ApiProperty() bankName: string;
}