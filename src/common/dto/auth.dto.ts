import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const PasswordValidation = {
  MinLength: 8,
  MaxLength: 100,
  Pattern: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  Message: 'Password too weak',
};

class BasePasswordDto {
  @MinLength(PasswordValidation.MinLength)
  @MaxLength(PasswordValidation.MaxLength)
  @Matches(PasswordValidation.Pattern, {
    message: PasswordValidation.Message,
  })
  password: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateUserDto {
  @ApiProperty() @IsNotEmpty() @IsString() firstName: string;
  @ApiProperty() @IsNotEmpty() @IsString() lastName: string;
  @ApiProperty() @IsNotEmpty() @IsEmail() email: string;
  @ApiProperty() @IsNotEmpty() @IsString() gender: string;
  @ApiProperty() @IsNotEmpty() @IsString() phoneNumber: string;
  @ApiProperty() @IsNotEmpty() @IsString() bvn: string;

  @ApiProperty()
  @MinLength(PasswordValidation.MinLength)
  @MaxLength(PasswordValidation.MaxLength)
  @Matches(PasswordValidation.Pattern, {
    message: PasswordValidation.Message,
  })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

export class VerifyOtp {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  otp: string;
}

export class ResendOtp {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class ResendForgotPasswordOtp {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateUserProfileDto {
  @ApiProperty() @IsOptional() @IsString() firstName?: string;
  @ApiProperty() @IsOptional() @IsString() lastName?: string;
  @ApiProperty() @IsOptional() @IsString() phoneNumber?: string;
  @ApiProperty() @IsOptional() @IsString() @IsEmail() email?: string;
  @ApiProperty() @IsOptional() @IsString() bvn?: string;
}
