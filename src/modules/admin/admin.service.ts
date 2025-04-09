import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { LoginDto, VerifyOtp, ResendOtp } from 'src/common/dto/auth.dto';
import { Helpers } from 'src/common/helpers';
import { EmailService } from '../email/email.service';
import * as moment from 'moment';
import { DateUtil } from '../../common/utils/date.util';
import { generateTokens } from 'src/common/utils/token.provider';
import { Admin } from 'src/models/admin.model';
import {
  ForgotPasswordDto,
  InviteAdminDto,
  ChangeAdminPasswordDto,
  createSuperAdminDto,
} from '../../common/dto/admin.dto';
import { RoleService } from '../role/role.service';
import { User } from 'src/models/user.model';


@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService,
    private readonly roleService: RoleService,
  ) {}

  async registerSuperAdmin(body: createSuperAdminDto) {
    try {
      const emailExists = await this.adminModel.findOne({
        email: body.email,
      });
      // console.log(emailExists);
      if (emailExists) throw new BadRequestException('Email already exists');

      createSuperAdminDto['email'] = body.email.trim().toLowerCase();

      const generatedPassword = Helpers.generatePassword(10);
      const hashedPassword = await Helpers.hashPassword(generatedPassword);

      let admin = new this.adminModel({
        ...body,
        isSuperAdmin: true,
        password: hashedPassword,
        isVerified: true,
        isActive: true,
      });

      admin = await admin.save();

      await this.emailService.sendAdminCreationEmail(
        admin.email,
        generatedPassword,
      );

      return admin;
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(body: LoginDto): Promise<IServiceResponse> {
    try {
      const user = await this.adminModel
        .findOne({ email: body.email })
        .select('+password');
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!user.isVerified) {
        throw new BadRequestException(
          'User is not verified and cannot log in.',
        );
      }

      // if (user.lockUntil && new Date() < user.lockUntil) {
      //   const remainingTime = Math.ceil(
      //     (user.lockUntil.getTime() - Date.now()) / 60000,
      //   );
      //   throw new ForbiddenException(
      //     `Account locked. Try again in ${remainingTime} minutes.`,
      //   );
      // }

      const isMatch = await Helpers.verifyPassword(
        user.password,
        body.password,
      );
      if (!isMatch) {
        user.failedLoginAttempt += 1;

        // if (user.failedLoginAttempt >= 3) {
        //   user.lockUntil = new Date(Date.now() + 60 * 60 * 1000);
        //   user.failedLoginAttempt = 0;
        // }

        await user.save();
        throw new UnauthorizedException('Invalid credentials');
      }

      // user.lockUntil = null;
      user.failedLoginAttempt = 0;
      user.loginCount += 1;
      await user.save();

      const token = await generateTokens(user).accessToken;

      if (!user.isPasswordChanged) {
        return {
          data: {
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              isPasswordChanged: user.isPasswordChanged,
            },
            token,
          },
        };
      }


      return {
        data: {
          user,
          token,
        },
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyAdmin(body: VerifyOtp): Promise<IServiceResponse> {
    try {
      const { email, otp } = body;

      const user = await this.adminModel.findOne({ email });

      if (!user) {
        throw new BadRequestException('Admin does not exist');
      }

      if (user.isVerified) {
        throw new BadRequestException('Admin already verified.');
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

      return {
        data: {
          isVerified: true,

          message: 'Email verified successfully',
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
      const user = await this.adminModel.findOne({ email });
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

      await this.emailService.sendVerificationEmail(body.email, user.name, otp);
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

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    try {
      const { email } = forgotPasswordDto;

      const admin = await this.adminModel.findOne({
        email: email.toLowerCase(),
      });

      if (!admin) throw new NotFoundException('This admin does not exist');

      const newPassword = Helpers.generatePassword(8);
      const hashedPassword = await Helpers.hashPassword(newPassword);

      await this.adminModel.findByIdAndUpdate(admin._id, {
        password: hashedPassword,
        isPasswordChanged: false,
      });

      const name = admin.name;
      console.log(newPassword)
      await this.emailService.sendAdminForgotPasswordEmail(
        admin.email,
        name,
        newPassword,
      );

      
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAdminById(id: string): Promise<IServiceResponse> {
    const admin = await this.adminModel.findById(id).populate('role');
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return {
      data: admin,
    };
  }

  async inviteAdmin(inviteAdminDto: InviteAdminDto): Promise<Admin> {
    try {
      const emailExists = await this.adminModel.findOne({
        email: inviteAdminDto.email,
      });
      console.log(emailExists);
      if (emailExists) throw new BadRequestException('Email already exists');

      inviteAdminDto['email'] = inviteAdminDto.email.trim().toLowerCase();

      const generatedPassword = Helpers.generatePassword(10);
      const hashedPassword = await Helpers.hashPassword(generatedPassword);

      const roleResponse = await this.roleService.findById(inviteAdminDto.role);
      const role = roleResponse.data;
      if (!role) throw new BadRequestException('Role not found');

      let admin = new this.adminModel({
        ...inviteAdminDto,
        role: role._id,
        password: hashedPassword,
        isVerified: true,
      });

      admin = await admin.save();

      await this.emailService.sendAdminCreationEmail(
        admin.email,
        generatedPassword,
      );

      return admin;
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(
    adminId: string,
    resetAdminPasswordDto: ChangeAdminPasswordDto,
  ): Promise<IServiceResponse> {
    try {
      const { newPassword, confirmPassword } = resetAdminPasswordDto;

      if (newPassword !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }

      const admin = await this.adminModel.findById(adminId);

      if (!admin) throw new NotFoundException('Admin not found');

      const hashedPassword = await Helpers.hashPassword(newPassword);

      await this.adminModel.findByIdAndUpdate(admin._id, {
        password: hashedPassword,
        isPasswordChanged: true,
        isActive: true,
      });

      const name = admin.name;

      await this.emailService.sendResetPasswordEmail(admin.email, name);

      return {
        data: {
          message: 'Password reset successfully',
        },
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsersWithCounts(
    skip: number,
    limit: number,
    search?: string,
  ): Promise<IServiceResponse> {
    try {
      const query = this.searchQuery(search);

      const users = await this.userModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .select('-password')
        .sort({ createdAt: -1 })
        .exec();

      const [totalCount, activeCount, inactiveCount] = await Promise.all([
        this.userModel.countDocuments(query).exec(),
        this.userModel.countDocuments({ ...query, isActive: true }).exec(),
        this.userModel.countDocuments({ ...query, isActive: false }).exec(),
      ]);

      return {
        data: {
          users,
          counts: {
            total: totalCount,
            active: activeCount,
            inactive: inactiveCount,
          },
        },
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private searchQuery(search?: string): object {
    if (!search) return {};

    const regexSearch = new RegExp(search || '', 'i');
    return {
      $or: [
        { firstName: regexSearch },
        { lastName: regexSearch },
        { email: regexSearch },
      ],
    };
  }

  async getUserById(userId: string): Promise<IServiceResponse> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        data: user,
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllAdmins(
    skip: number,
    limit: number,
    search?: string,
    currentAdminId?: string,
  ): Promise<IServiceResponse> {
    const query = this.searchQueryAdmins(search, currentAdminId);
    const admins = await this.adminModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    return {
      data: admins,
    };
  }

  private searchQueryAdmins(search?: string, currentAdminId?: string): object {
    const regexSearch = new RegExp(search || '', 'i');
    const query: any = {};

    return {
      $and: [
        query,
        {
          $or: [{ name: regexSearch }, { email: regexSearch }],
        },
        { _id: { $ne: currentAdminId } },
      ],
    };
  }

  async countAllAdmins(
    search?: string,
    currentAdminId?: string,
  ): Promise<number> {
    const query = this.searchQueryAdmins(search, currentAdminId);
    return await this.adminModel.countDocuments(query).exec();
  }

  async incrementActivityCount(adminId: string): Promise<void> {
    try {
      await this.adminModel.findByIdAndUpdate(
        adminId,
        { $inc: { activityCount: 1 } },
        { new: true },
      );
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateLastLogin(adminId: string): Promise<void> {
    try {
      await this.adminModel.findByIdAndUpdate(
        adminId,
        { $set: { lastLogin: moment().toDate() } },
        { new: true },
      );
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async revokeAdminAccess(adminId: string): Promise<IServiceResponse> {
    try {
      const admin = await this.adminModel.findById(adminId);
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      await this.adminModel.findByIdAndUpdate(adminId, {
        isActive: false,
      });

      return {
        data: {
          message: 'Admin access revoked successfully',
        },
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async restoreAdminAccess(adminId: string): Promise<IServiceResponse> {
    try {
      const admin = await this.adminModel.findById(adminId);
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      await this.adminModel.findByIdAndUpdate(adminId, {
        isActive: true,
      });

      return {
        data: {
          message: 'Admin access restored successfully',
        },
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
