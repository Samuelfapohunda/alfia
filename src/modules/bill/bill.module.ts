import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/models/admin.model';
import { BillController } from './bill.controller';
import { BillService } from './bill.service';
import { EmailService } from '../email/email.service';
import { MailService } from 'src/common/services/mail.service';
import { RoleService } from '../role/role.service';
import { Role, RoleSchema } from 'src/models/role.model';
import { User, UserSchema } from 'src/models/user.model';
import { Hospital, HospitalSchema } from 'src/models/hospital.model';
import { Bill, BillSchema } from 'src/models/bill.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Hospital.name, schema: HospitalSchema },
      { name: Bill.name, schema: BillSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BillController],
  providers: [
    BillService,
    MailService,
    RoleService,
    EmailService,
  ],
  exports: [MongooseModule],
})
export class BillModule {}
