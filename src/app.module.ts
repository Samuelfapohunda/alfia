import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MONGO_URI } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from './modules/role/role.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/users/users.module';
import { HospitalModule } from './modules/hospital/hospital.module';
import { BillModule } from './modules/bill/bill.module';
import { CreditRequestModule } from './modules/creditRequest/credit-request.module';
import { CreditScoreModule } from './modules/credit-score/credit-score.module';
import { LoanModule } from './modules/loan/loan.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    AuthModule,
    RoleModule,
    UserModule,
    AdminModule,
    HospitalModule,
    BillModule,
    CreditRequestModule,
    CreditScoreModule,
    LoanModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
