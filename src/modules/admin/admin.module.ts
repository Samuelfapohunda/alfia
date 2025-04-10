import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/models/admin.model';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { EmailService } from '../email/email.service';
import { MailService } from 'src/common/services/mail.service';
import { RoleService } from '../role/role.service';
import { Role, RoleSchema } from 'src/models/role.model';
import { User, UserSchema } from 'src/models/user.model';
import { Hospital, HospitalSchema } from 'src/models/hospital.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
      { name: Hospital.name, schema: HospitalSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, MailService, RoleService, EmailService],
  exports: [MongooseModule],
})
export class AdminModule {}