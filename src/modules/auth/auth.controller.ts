import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Headers,
    UseGuards,
    Request,
    Res,
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiHeader,
    ApiOperation,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
  import { AuthService } from './auth.service';
  import {
    LoginDto,
    CreateUserDto,
    ResendForgotPasswordOtp,
    ResendOtp,
    ResetPasswordDto,
    VerifyOtp,
    UpdateUserProfileDto,
  } from 'src/common/dto/auth.dto';
  import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
  import { AuthGuard } from '../../common/guards/auth.guard';
  import { GetCurrentUserId } from '../../common/decorators/getCurrentUser.decorator';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'User registered successfully',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'User already exists',
    })
    @ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
    })
    async register(@Body() body: CreateUserDto): Promise<IServiceResponse> {
      return this.authService.create(body);
      
    }
  

    
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
    schema: {
      properties: {
        data: {
          type: 'object',
          properties: {
            user: {
              type: 'object',
              description: 'User information',
            },
            tokens: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<IServiceResponse> {
    return this.authService.login(body);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiHeader({
    name: 'refresh-token',
    description: 'Refresh token from login',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refreshed successfully',
    schema: {
      properties: {
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid refresh token or token not provided',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Headers() headers: any,
    @Headers('refresh-token') refreshToken: string,
  ): Promise<IServiceResponse> {
    const token = refreshToken || headers['refresh-token'];
    return this.authService.refreshToken(token);
  }

//   @UseGuards(JwtAuthGuard)
  @Post('update-profile')
  async updateProfile(
    @Request() req,
    @Res() res: Response,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @GetCurrentUserId() userId: string
  ) {

    return await this.authService.updateProfile(
      userId,
      updateUserProfileDto,
    );
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resends otp for verification' })
  @HttpCode(HttpStatus.OK) 
  async resendOtp(@Body() body: ResendOtp): Promise<IServiceResponse> {
    return this.authService.resendOtp(body);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verifies otp for verification' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User verified successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid otp',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async verifyUser(@Body() body: VerifyOtp): Promise<IServiceResponse> {
    return this.authService.verifyUser(body);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Sends reset password OTP to email' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ResendOtp): Promise<IServiceResponse> {
    return this.authService.forgotPassword(body);
  }

  @Post('resend-password-otp')
  @ApiOperation({ summary: 'Resends otp for forgot password' })
  @HttpCode(HttpStatus.OK)
  async resendForgotPasswordOtp(
    @Body() body: ResendForgotPasswordOtp,
  ): Promise<IServiceResponse> {
    return this.authService.resendForgotPasswordOtp(body);
  }

  @Post('verify-forgot-password-otp')
  @ApiOperation({ summary: 'Verifies forgot password otp' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP verified successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid OTP or OTP has expired',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async verifyForgotPasswordOtp(
    @Body() body: VerifyOtp,
  ): Promise<IServiceResponse> {
    return this.authService.verifyForgotPasswordOtp(body);
  }

  @Post('reset-password')
  @ApiOperation({ summary: `Resets user's password` })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'OTP not verified',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Provided passwords do not match',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<IServiceResponse> {
    return this.authService.resetPassword(body);
  }
}
