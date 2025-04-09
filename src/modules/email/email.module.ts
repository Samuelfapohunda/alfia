import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailService } from 'src/common/services/mail.service';
import { User, UserSchema } from 'src/models/user.model';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [EmailController],
  providers: [EmailService, MailService],
  exports: [EmailService],
})
export class EmailModule {}
