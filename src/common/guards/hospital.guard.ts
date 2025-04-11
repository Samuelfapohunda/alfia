import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hospital } from '../../models/hospital.model';
import { Request } from 'express';
import { HospitalService } from 'src/modules/hospital/hospital.service';

// @Injectable()
// export class HospitalGuard implements CanActivate {
//   constructor(
//     @InjectModel(Hospital.name) private readonly hospitalModel: Model<Hospital>,
//     private readonly reflector: Reflector,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const userId = request.user._id;


//     console.log('User ID from request:', userId);
//     const authHeader = request.headers.authorization;
 
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthorizedException('Authorization token missing or invalid');
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//     //   const payload = this.jwtService.verify(token);

//     //   const hospital = await this.hospitalModel.findById(payload.sub);
//       const hospital = await this.hospitalModel.findById(userId);

//       if (!hospital) {
//         throw new UnauthorizedException('Hospital not found');
//       }

//       if (!hospital.isVerified) {
//         throw new ForbiddenException('Hospital not verified');
//       }

//       if (!hospital.isActive) {
//         throw new ForbiddenException('Hospital account is inactive');
//       }

//       request.user = {
//         id: hospital._id,
//         email: hospital.email,
//         name: hospital.name,
//         role: 'hospital',
//       };

//       return true;
//     } catch (error) {
//       console.error(error);
//       throw new UnauthorizedException('Invalid or expired token');
//     }
//   }
// }


@Injectable()
export class HospitalGuard implements CanActivate {
  constructor(private hospitalServcie: HospitalService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.payload._id;
    const hospital = await this.hospitalServcie.findHospitalById(userId);
    if (hospital && hospital.data.isActive) return true;
    throw new HttpException('User not authorized', HttpStatus.FORBIDDEN);
  }
}