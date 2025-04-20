import {
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

  async getWallet(): Promise<IServiceResponse> {
    const wallet = await this.walletModel.findOne({ isDefault: true });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return {
      data: wallet,
    };
  }
}
