import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { MONGO_URI } from './config/env.config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from './modules/role/role.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    AuthModule,
    RoleModule,
    UserModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
