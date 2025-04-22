import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/models/admin.model';
import { CreditRequestController } from './credit-request.controller';
import { CreditRequestService } from './credit-request.service';
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
import { Loan, LoanSchema } from 'src/models/loan.model';
import { CreditScoreService } from '../credit-score/credit-score.service';
import { LoanService } from '../loan/loan.service';
import { CreditScore, CreditScoreSchema } from 'src/models/credit-score.model';
import { HttpModule } from '@nestjs/axios';
import { ZeehService } from '../zeeh/zeeh.service';
import { WalletService } from '../wallet/wallet.service';
import { Wallet, WalletSchema } from 'src/models/wallet.model';
import { TransactionService } from '../transaction/transaction.service';
import { Transaction, TransactionSchema } from 'src/models/transaction.model';
import { FraudDetectionService } from './fraud-detection.service';

@Module({
  imports: [
     HttpModule,
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: CreditRequest.name, schema: CreditRequestSchema },
      { name: Hospital.name, schema: HospitalSchema },
      { name: CreditScore.name, schema: CreditScoreSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Loan.name, schema: LoanSchema },
      { name: Hospital.name, schema: HospitalSchema }, 
      { name: Bill.name, schema: BillSchema },
      { name: Role.name, schema: RoleSchema }, 
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CreditRequestController],
  providers: [
    WalletService,
    CreditRequestService,
    TransactionService,
    MailService,
    AdminService,
    FraudDetectionService,
    ZeehService,
    RoleService,
    EmailService,
    HospitalService,
    CreditScoreService,
    LoanService,
    UsersService
  ],
  exports: [MongooseModule],
})
export class CreditRequestModule {}
