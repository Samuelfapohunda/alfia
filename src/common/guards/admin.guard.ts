import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AdminService } from 'src/modules/admin/admin.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private adminService: AdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.payload._id;
    const response = await this.adminService.findAdminById(userId);
    const admin = response.data;
    if (admin && admin.isSuperAdmin && admin.isActive) return true;
    throw new HttpException('User not authorized', HttpStatus.FORBIDDEN);
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private adminService: AdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.payload._id;
    const admin = await this.adminService.findAdminById(userId);
    if (admin && admin.data.isActive) return true;
    throw new HttpException('User not authorized', HttpStatus.FORBIDDEN);
  }
}
