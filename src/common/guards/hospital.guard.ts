import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HospitalService } from 'src/modules/hospital/hospital.service';

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
