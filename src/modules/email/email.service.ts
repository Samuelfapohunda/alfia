import { Injectable, NotFoundException } from '@nestjs/common';
import {
  getAccountCreationPinEmail,
  getAdminForgotPasswordEmail,
  getAdminInvitationEmail,
  getChangePasswordEmail,
  getForgotPasswordEmail,
  getHospitalRegistrationEmail,
  getResetPasswordEmail,
  getVerificationEmail,
  getVerificationSuccessfulEmail,
  sendConfirmationEmail,
} from './email.template';
import { MailService } from 'src/common/services/mail.service';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../models/user.model';

@Injectable()
export class EmailService {
  constructor(
    private mailService: MailService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async sendVerificationEmail(
    email: string,
    name: string,
    token: string,
  ): Promise<void> {
    const body = getVerificationEmail(name, token);
    const subject = 'Complete your onboarding';
    await this.mailService.sendEmail(email, subject, body);
  }

  public async sendAccountCreationPasswordEmail(
    email: string,
    name: string, 
    password: number,
  ): Promise<void> {
    const body = getAccountCreationPinEmail(name, password);
    const subject = 'Create an account with this pin.';
    await this.mailService.sendEmail(email, subject, body);
  }

  public async sendForgotPasswordEmail(
    email: string,
    firstName: string,
    token: string,
  ): Promise<void> {
    const body = getForgotPasswordEmail(firstName, token);
    const subject = 'Forgot Password Email';
    await this.mailService.sendEmail(email, subject, body);
  }

  public async sendAdminForgotPasswordEmail(
    email: string,
    firstName: string,
    newPassword: string,
  ): Promise<void> {
    const body = getAdminForgotPasswordEmail(firstName, newPassword);
    const subject = 'Reset Password Email';
    await this.mailService.sendEmail(email, subject, body);
  }

  public async sendResetPasswordEmail(
    email: string,
    firstName: string,
  ): Promise<void> {
    const body = getResetPasswordEmail(firstName);
    const subject = 'Reset Password Successful';
    await this.mailService.sendEmail(email, subject, body);
  }

  public async sendHospitalOnboardingEmail(
    email: string,
    name: string,
  ): Promise<void> {
    const body = getHospitalRegistrationEmail(name);
    const subject = 'Hospital Registration';
    await this.mailService.sendEmail(email, subject, body);
  }

  public async sendConfirmationMail(
    email: string,
    firstName: string,
  ): Promise<void> {
    const body = sendConfirmationEmail(firstName);
    const subject = 'Message Received';
    await this.mailService.sendEmail(email, subject, body);
  }

  public async sendVerificationSuccessfulEmail(
    email: string,
    firstName: string,
  ): Promise<void> {
    const body = getVerificationSuccessfulEmail(firstName);
    const subject = 'Account Verification Successful';
    await this.mailService.sendEmail(email, subject, body);
  }

  public async sendChangePasswordEmail(
    email: string,
    firstName: string,
  ): Promise<void> {
    const body = getChangePasswordEmail(firstName);
    const subject = 'Password Change Successful';
    await this.mailService.sendEmail(email, subject, body);
  }

  public async sendAdminCreationEmail(
    email: string,
    password: string,
  ): Promise<void> {
    const body = getAdminInvitationEmail(password);
    const subject = 'Admin Invitation';
    await this.mailService.sendEmail(email, subject, body);
  }
}
