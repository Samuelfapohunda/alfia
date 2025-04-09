import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.model';
import { EmailService } from '../email/email.service';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([ 
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService,MailService, EmailService],
})
export class AuthModule {}
