import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
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
  

  export class ForgotUserPasswordDto {
    @ApiProperty() @IsNotEmpty() @IsString() @IsEmail() email: string;
  }
  
  export class ResetUserPasswordDto extends BasePasswordDto {
    @ApiProperty() @IsNotEmpty() token: string;
  }
  
  export class ResendVerificationLinkDto extends ForgotUserPasswordDto {}
  
  export class VerifyUserDto {
    @ApiProperty() @IsNotEmpty() token: string;
  }
  
  export class ChangeUserPasswordDto extends BasePasswordDto {
    @ApiProperty() @IsNotEmpty() prevPassword: string;
  }
  
  export class UpdateUserProfileDto {
    @ApiProperty() @IsOptional() @IsString() firstName?: string;
    @ApiProperty() @IsOptional() @IsString() lastName?: string;
    @ApiProperty() @IsOptional() @IsString() phoneNumber?: string;
    @ApiProperty() @IsOptional() @IsString() @IsEmail() email?: string;
    @ApiProperty() @IsOptional() @IsString() bvn?: string;
  }
  