import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { User } from 'src/models/user.model';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { Helpers } from 'src/common/helpers';
import { EmailService } from '../email/email.service';
import * as moment from 'moment';
import { DateUtil } from 'src/common/utils/date.util';
import {
  LoginDto,
  CreateUserDto,
  VerifyOtp,
  ResendOtp,
  ResetPasswordDto,
  ResendForgotPasswordOtp,
  UpdateUserProfileDto,
} from 'src/common/dto/auth.dto';
import { generateTokens } from 'src/common/utils/token.provider';
import {
  JsonWebTokenError,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
  verify,
} from 'jsonwebtoken';
import { REFRESH_TOKEN_SECRET } from 'src/config/env.config';

@Injectable()
export class AuthService {
constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService,
   ) {}

    async create(body: CreateUserDto): Promise<IServiceResponse> {
        try {
            const existingUser = await this.userModel.findOne({ email: body.email });
            if (existingUser) {
              throw new BadRequestException('User with this email already exists');
            }
      
            // if (body.password !== body.confirmPassword) {
            //   throw new BadRequestException('Passwords do not match');
            // }
      
            const newUser = new this.userModel({
              ...body,
              password: await Helpers.hashPassword(body.password),
            });
      
            const otp = Helpers.generateOtp(6);
            const otpExpiration = moment(DateUtil.getCurrentDate())
              .add(10, 'minutes')
              .toDate();
      
            newUser.otp = otp;
            newUser.otpExpiration = otpExpiration;
      
            await newUser.save();
      
            await this.emailService.sendVerificationEmail(
              body.email,
              body.firstName,
              otp,
            );
      
            return {
              data: {
                message: 'User registered successfully, please verify your email.',
                newUser,
              },
            };
        } catch (ex) {
          throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }


      
  async login(body: LoginDto): Promise<IServiceResponse> {
    try {
      const user = await this.userModel
        .findOne({ email: body.email })
        .select('+password')
        .exec();

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (user.lockUntil && new Date() < user.lockUntil) {
        const remainingTime = Math.ceil(
          (user.lockUntil.getTime() - Date.now()) / 60000,
        );
        throw new ForbiddenException(
          `Account locked. Try again in ${remainingTime} minutes.`,
        );
      }

      const isMatch = await Helpers.verifyPassword(
        user.password,
        body.password,
      );
      if (!isMatch) {
        user.failedLoginAttempt += 1;

        if (user.failedLoginAttempt >= 3) {
          user.lockUntil = new Date(Date.now() + 60 * 60 * 1000);
          user.failedLoginAttempt = 0;
        }

        await user.save();
        throw new UnauthorizedException('Invalid credentials');
      }

      const tokens = await generateTokens(user);

      user.refreshToken = tokens.refreshToken;
      user.failedLoginAttempt = 0;
      user.loginCount += 1;
      user.lastLogin = new Date();
      await user.save();

      const userObj = user.toObject();
      delete (userObj as { refreshToken?: string }).refreshToken;
      delete (userObj as { password?: string }).password;

      return {
        data: {
          user: userObj,
          tokens,
        },
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async refreshToken(refreshToken: string): Promise<IServiceResponse> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    try {
      const decoded = verify(refreshToken, REFRESH_TOKEN_SECRET) as JwtPayload;
      const user = await this.userModel
        .findById(decoded.payload._id)
        .select('+refreshToken');

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await generateTokens(user);

      user.refreshToken = tokens.refreshToken;
      await user.save();

      return { data: tokens };
    } catch (error) {
      console.error('Refresh token error:', error);

      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError ||
        error instanceof NotBeforeError ||
        error instanceof UnauthorizedException ||
        error instanceof MongooseError
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to refresh token');
    }
  }

  async verifyUser(body: VerifyOtp): Promise<IServiceResponse> {
    try {
      const { email, otp } = body;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new BadRequestException('User does not exist');
      }

      if (user.isVerified) {
        throw new BadRequestException('User already verified.');
      }

      if (!user.otp || user.otp !== otp) {
        throw new BadRequestException('Invalid OTP');
      }

      const currentTime = DateUtil.getCurrentDate();
      if (!user.otpExpiration || currentTime > user.otpExpiration) {
        throw new BadRequestException('OTP has expired');
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiration = undefined;
      await user.save();

      const tokens = generateTokens(user);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return {
        data: {
          message: 'Email verified successfully',
          user: {
            isVerified: true,
          },
          tokens,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resendOtp(body: ResendOtp): Promise<IServiceResponse> {
    try {
      const { email } = body;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const otp = Helpers.generateOtp(6);
      const otpExpiration = moment(DateUtil.getCurrentDate())
        .add(10, 'minutes')
        .toDate();

      user.otp = otp;
      user.otpExpiration = otpExpiration;
      await user.save();

      await this.emailService.sendVerificationEmail(
        body.email,
        user.firstName,
        otp,
      );
      return {
        data: {
          message: 'Otp sent successfully',
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async forgotPassword(body: ResendOtp): Promise<IServiceResponse> {
    try {
      const { email } = body;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return {
          data: {
            success: true,
            message:
              'If a user with that email exists, a password reset OTP will be sent.',
          },
        };
      }

      const resetPasswordToken = Helpers.generateOtp(6);
      const resetPasswordExpires = moment(DateUtil.getCurrentDate())
        .add(10, 'minutes')
        .toDate();

      await this.userModel.findByIdAndUpdate(user._id, {
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpires,
      });

      await this.emailService.sendForgotPasswordEmail(
        email,
        user.firstName,
        resetPasswordToken,
      );

      return {
        data: {
          message: 'Reset password mail sent successfully',
        },
      };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resendForgotPasswordOtp(
    body: ResendForgotPasswordOtp,
  ): Promise<IServiceResponse> {
    try {
      const { email } = body;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const resetPasswordToken = Helpers.generateOtp(6);
      const resetPasswordExpires = moment(DateUtil.getCurrentDate())
        .add(10, 'minutes')
        .toDate();

      user.resetPasswordToken = resetPasswordToken;
      user.resetPasswordExpires = resetPasswordExpires;
      await user.save();

      await this.emailService.sendForgotPasswordEmail(
        email,
        user.firstName,
        resetPasswordToken,
      );
      return {
        data: {
          message: 'Otp sent successfully',
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyForgotPasswordOtp(body: VerifyOtp): Promise<IServiceResponse> {
    try {
      const { email, otp } = body;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new BadRequestException('User does not exist');
      }

      if (!user.resetPasswordToken || user.resetPasswordToken !== otp) {
        throw new BadRequestException('Invalid OTP');
      }

      const currentTime = DateUtil.getCurrentDate();
      if (currentTime > user.resetPasswordExpires) {
        throw new BadRequestException('OTP has expired');
      }

      user.resetPasswordToken = '';
      user.resetPasswordExpires = new Date(0); ;
      await user.save();

      return {
        data: {
          message: 'OTP verified successfully',
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(body: ResetPasswordDto): Promise<IServiceResponse> {
    try {
      const { password, confirmPassword, email } = body;

      const user = await this.userModel.findOne({
        email,
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (user.resetPasswordToken !== '') {
        throw new BadRequestException('OTP not verified');
      }

      if (password !== confirmPassword) {
        throw new ForbiddenException('Passwords do not match');
      }

      const hash = await Helpers.hashPassword(password);
      await this.userModel.findByIdAndUpdate(
        user._id,
        {
          password: hash,
        },
        { new: true, useFindAndModify: false },
      );

      await this.emailService.sendResetPasswordEmail(email, user.firstName);
      return {
        data: {
          message: 'Password reset successfully',
        },
      };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException || ForbiddenException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.userModel.findByIdAndUpdate(
        userId,
        { $set: { lastLogin: moment().format('DD/MM/YYYY, h:mm:ssA') } },
        { new: true },
      );
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  
  async updateProfile(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<IServiceResponse> {
    try {
      const { firstName, lastName, phoneNumber, email, bvn } =
        updateUserProfileDto;

      let user = await this.userModel.findById(userId);
      if (!user) throw new NotFoundException('User not found');

      user = await this.userModel
        .findByIdAndUpdate(
          user._id,
          {
            $set: {
              firstName,
              lastName,
              phoneNumber,
              email,
              bvn,
            },
          },
          { new: true },
        )
        .select('-password');

      return {
        data: {
          message: 'User profile updated successfully',
          user,
        },
      };
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
 

