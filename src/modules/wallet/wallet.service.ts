import {
    BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Model } from 'mongoose';
import { CreditScore } from 'src/models/credit-score.model';
import { UsersService } from '../users/users.service';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { ZeehService } from '../zeeh/zeeh.service';
import { Loan } from 'src/models/loan.model';
import { Hospital } from 'src/models/hospital.model';
import { CreditRequest } from 'src/models/credit-request.model';
import { Bill } from 'src/models/bill.model';
import { Wallet } from 'src/models/wallet.model';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<Wallet>,
  ) {}

  async fundSystemWallet(amount: number): Promise<void> {
    let wallet = await this.walletModel.findOne();

    if (!wallet) {
      wallet = new this.walletModel({ amount: amount });
    } else {
      wallet.amount += amount;
    }

    await wallet.save();
  }

  async getBalance(): Promise<number> {
    const wallet = await this.walletModel.findOne();
    return wallet?.amount ?? 0;
  }

  async debitWallet(amount: number): Promise<void> {
    const wallet = await this.walletModel.findOne();
    if (!wallet) throw new NotFoundException('System wallet not found');
    if (wallet.amount < amount) throw new BadRequestException('Insufficient wallet balance');
    
    wallet.amount -= amount;
    await wallet.save();
  }
  
}
