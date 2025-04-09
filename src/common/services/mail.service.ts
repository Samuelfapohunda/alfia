import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SentMessageInfo, Options>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(email: string, subject: string, message: string) {
    const mailOptions = { 
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: message,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully.');
      console.log('Message sent: %s', info.messageId);
    } catch (error) { 
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send OTP email');
    }
  }
}
