import * as OTP from 'n-digit-token';
import { randomBytes } from 'crypto';
import { hash, verify } from 'argon2';
import * as moment from 'moment';
import { CreditRequestFrequencyEnum, Frequency } from '../enums/credit-request.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

export class Helpers {
  static generateOtp(length: number): string {
    const token = OTP.gen(length);
    return token;
  }

  static generateToken(length: number): string {
    return randomBytes(length).toString('hex');
  }

  static hashPassword(password: string): Promise<string> {
    const data = hash(password);
    return data;
  }

  static verifyPassword(hash: string, password: string): Promise<boolean> {
    const data = verify(hash, password);
    return data;
  }

  static generatePassword(length: number): string {
    const charSet =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';

    let password = '';
    for (let i = 0; i < length; i++) {
      const at = Math.floor(Math.random() * (charSet.length + 1));
      password += charSet.charAt(at);
    }

    return password;
  }

  static generateReference(): string {
    const now = new Date();
    const formattedDate = now
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(0, 14);

    const uniqueId = randomBytes(12).toString('hex');

    return `${formattedDate}-${uniqueId}`;
  }


  
static calculateNextRepaymentDate(
  startDate: Date,
  frequency: string,
): Date {
  const start = moment(startDate);

  switch (frequency) {
    case CreditRequestFrequencyEnum.Daily:
      return start.add(1, 'days').toDate();
    case CreditRequestFrequencyEnum.Weekly:
      return start.add(1, 'weeks').toDate();
    case CreditRequestFrequencyEnum.Monthly:
      return start.add(1, 'months').toDate();
    default:
      throw new HttpException('Invalid frequency', HttpStatus.BAD_REQUEST);
  }
}

static calculateEndDate = (
  startDate: Date,
  frequency: CreditRequestFrequencyEnum,
  duration: number,
): Date => {
  const start = moment(startDate);

  switch (frequency) {
    case 'daily':
      return start.add(duration, 'days').toDate();
    case 'weekly':
      return start.add(duration, 'weeks').toDate();
    case 'monthly':
      return start.add(duration, 'months').toDate();
    default:
      throw new Error('Invalid frequency');
  }
};
}
