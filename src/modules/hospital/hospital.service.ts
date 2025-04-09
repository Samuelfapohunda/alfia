import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHospitalDto, UpdateHospitalDto } from 'src/common/dto/hospital.dto';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { MailService } from 'src/common/services/mail.service';
import { Hospital } from 'src/models/hospital.model';
import { EmailService } from '../email/email.service';

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
}
