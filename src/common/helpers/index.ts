import * as OTP from 'n-digit-token';
import { randomBytes } from 'crypto';
import { hash, verify } from 'argon2';

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
}
