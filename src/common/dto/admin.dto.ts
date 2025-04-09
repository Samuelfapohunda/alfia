import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../enums/gender.enum';

export class createSuperAdminDto {
  @IsNotEmpty() @IsString() @ApiProperty() name: string;
  @IsNotEmpty() @IsString() @ApiProperty() email: string;
}

export class InviteAdminDto {
  @IsNotEmpty() @IsString() @ApiProperty() name: string;
  @IsNotEmpty() @IsString() @ApiProperty() email: string;
  @IsNotEmpty() @IsString() @ApiProperty() gender: Gender;
  @IsNotEmpty() @ApiProperty() role: string;
}

export class ForgotPasswordDto {
  @IsNotEmpty() @ApiProperty() @IsEmail() email: string;
}

export class ChangeAdminPasswordDto {
  @IsNotEmpty() @ApiProperty() newPassword: string;
  @IsNotEmpty() @ApiProperty() confirmPassword: string;
}

export class UpdateProfileDto {
  @IsNotEmpty() @IsString() @ApiProperty() firstName: string;
  @IsNotEmpty() @IsString() @ApiProperty() lastName: string;
  @IsNotEmpty() @IsString() @ApiProperty() phoneNumber: string;
}
