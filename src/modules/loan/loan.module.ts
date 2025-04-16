import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/models/admin.model';
import { EmailService } from '../email/email.service';
import { MailService } from 'src/common/services/mail.service';
import { RoleService } from '../role/role.service';
import { Role, RoleSchema } from 'src/models/role.model';
import { User, UserSchema } from 'src/models/user.model';
import { Hospital, HospitalSchema } from 'src/models/hospital.model';
import { Bill, BillSchema } from 'src/models/bill.model';
import { HospitalService } from '../hospital/hospital.service';
import { UsersService } from '../users/users.service';
import { CreditRequest, CreditRequestSchema } from 'src/models/credit-request.model';
import { AdminService } from '../admin/admin.service';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { CreditScore, CreditScoreSchema } from 'src/models/credit-score.model';
import { ZeehService } from '../zeeh/zeeh.service';
import { Loan, LoanSchema } from 'src/models/loan.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Loan.name, schema: LoanSchema },
      { name: CreditRequest.name, schema: CreditRequestSchema },
      { name: CreditScore.name, schema: CreditScoreSchema },
      { name: Hospital.name, schema: HospitalSchema },
      { name: Bill.name, schema: BillSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [LoanController],
  providers: [
    LoanService,
    ZeehService,
    MailService,
    AdminService,
    RoleService,
    EmailService,
    HospitalService,
    UsersService
  ],
  exports: [MongooseModule],
})
export class LoanModule {}
