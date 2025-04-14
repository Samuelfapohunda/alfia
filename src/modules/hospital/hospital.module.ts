import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/models/admin.model';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';
import { EmailService } from '../email/email.service';
import { MailService } from 'src/common/services/mail.service';
import { RoleService } from '../role/role.service';
import { Role, RoleSchema } from 'src/models/role.model';
import { User, UserSchema } from 'src/models/user.model';
import { Hospital, HospitalSchema } from 'src/models/hospital.model';
import { AdminService } from '../admin/admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Hospital.name, schema: HospitalSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [HospitalController],
  providers: [
    HospitalService,
    MailService,
    RoleService,
    EmailService,
    AdminService
  ],
  exports: [MongooseModule],
})
export class HospitalModule {}
