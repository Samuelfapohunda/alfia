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
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { ZeehService } from '../zeeh/zeeh.service';
import { Loan, LoanSchema } from 'src/models/loan.model';
import { HttpModule } from '@nestjs/axios';
import { Wallet, WalletSchema } from 'src/models/wallet.model';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: CreditRequest.name, schema: CreditRequestSchema },
      { name: Loan.name, schema: LoanSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Hospital.name, schema: HospitalSchema },
      { name: Bill.name, schema: BillSchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
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
export class WalletModule {}
