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
import { ChangeHospitalPasswordDto, CreateHospitalDto, ForgotPasswordDto, LoginDto, UpdateHospitalDto } from 'src/common/dto/hospital.dto';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { MailService } from 'src/common/services/mail.service';
import { Hospital } from 'src/models/hospital.model';
import { EmailService } from '../email/email.service';
import { Helpers } from 'src/common/helpers';
import { generateTokens } from 'src/common/utils/token.provider';

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital.name) private hospitalModel: Model<Hospital>,
    private emailService: EmailService,
  ) {}

  async createHospital(
    createHospitalDto: CreateHospitalDto,
  ): Promise<IServiceResponse> {
    try {

        const existingHospital = await this.hospitalModel.findOne({
            email: createHospitalDto.email,
          });
      
          if (existingHospital) {
            throw new HttpException(
              'Hospital already exists',
              HttpStatus.CONFLICT,
            );
          }

          
      const newHospital = new this.hospitalModel({
        ...createHospitalDto,
      });
      
      const hospital = await newHospital.save();
      
      await this.emailService.sendHospitalOnboardingEmail(
        hospital.email,
        hospital.name,
      );
      return {
        data: hospital,
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

async findAllHospitals(): Promise<IServiceResponse> {
    try {
      const hospitals = await this.hospitalModel.find().exec();
      return {
        data: hospitals,
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

async findHospitalById(id: string): Promise<IServiceResponse> {
    try {
      const hospital = await this.hospitalModel.findById(id).exec();
      if (!hospital) {
        throw new NotFoundException(`Hospital with ID ${id} not found`);
      }
      return {
        data: hospital,
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateHospital(
    id: string,
    updateHospitalDto: UpdateHospitalDto,
  ): Promise<Hospital> {
    const updatedHospital = await this.hospitalModel
      .findByIdAndUpdate(id, updateHospitalDto, { new: true })
      .exec();

    if (!updatedHospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    return updatedHospital;
  }

  async deleteHospital(id: string): Promise<IServiceResponse> {
    try {
      const deletedHospital = await this.hospitalModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedHospital) {
        throw new NotFoundException(`Hospital with ID ${id} not found`);
      }

      return {
        message: 'Hospital deleted successfully',
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(body: LoginDto): Promise<IServiceResponse> {
    try {
      const hospital = await this.hospitalModel
        .findOne({ email: body.email })
        .select('+password');
      if (!hospital) {
        throw new UnauthorizedException('Invalid credentials');
      }

      if (!hospital.isVerified) {
        throw new BadRequestException(
          'Hospital is not verified and cannot log in.',
        );
      }

      const isMatch = await Helpers.verifyPassword(
        hospital.password,
        body.password,
      );
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      await hospital.save();

      const token = await generateTokens(hospital).accessToken;

      if (!hospital.isPasswordChanged) {
        return {
          data: {
            hospital: {
              _id: hospital._id,
              name: hospital.name,
              email: hospital.email,
              isPasswordChanged: hospital.isPasswordChanged,
            },
            token,
          },
        };
      }

      return {
        data: {
          hospital,
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

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
      try {
        const { email } = forgotPasswordDto;
  
        const hospital = await this.hospitalModel.findOne({
          email: email.toLowerCase(),
        });
  
        if (!hospital) throw new NotFoundException('This hospital does not exist');
  
        const newPassword = Helpers.generatePassword(8);
        const hashedPassword = await Helpers.hashPassword(newPassword);
  
        await this.hospitalModel.findByIdAndUpdate(hospital._id, {
          password: hashedPassword,
          isPasswordChanged: false,
        });
  
        const name = hospital.name;
        console.log(newPassword);
        await this.emailService.sendAdminForgotPasswordEmail(
          hospital.email,
          name,
          newPassword,
        );
      } catch (ex) {
        throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }

    
      async resetPassword(
        adminId: string,
        resetHospitalPasswordDto: ChangeHospitalPasswordDto,
      ): Promise<IServiceResponse> {
        try {
          const { newPassword, confirmPassword } = resetHospitalPasswordDto;
    
          if (newPassword !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
          }
    
          const hospital = await this.hospitalModel.findById(adminId);
    
          if (!hospital) throw new NotFoundException('Hospital not found');
    
          const hashedPassword = await Helpers.hashPassword(newPassword);
    
          await this.hospitalModel.findByIdAndUpdate(hospital._id, {
            password: hashedPassword,
            isPasswordChanged: true,
            isActive: true,
          });
    
          const name = hospital.name;
    
          await this.emailService.sendResetPasswordEmail(hospital.email, name);
    
          return {
            data: {
              message: 'Password reset successfully',
            },
          };
        } catch (ex) {
          throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }
}
