import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { Model, ObjectId } from 'mongoose';

import {
  TransactionPaymentTypeEnum,
  TransactionStatus,
  TransactionTypeEnum,
} from '../../common/enums/transaction.enum';
import { TransactionService } from '../transaction/transaction.service';
import { UsersService } from '../users/users.service';
import { PaymentDto } from '../../common/dto/paystack.dto';
import { PaystackEndpointEnum } from '../../common/enums/paystack.enum';
import { PaymentService } from '../../common/utils/payment.service';
import { InjectModel } from '@nestjs/mongoose';
import { Paystack } from 'src/models/paystack.model';
import { AdminService } from '../admin/admin.service';
import { WalletService } from '../wallet/wallet.service';
import { response } from 'express';

@Injectable()
export class PaystackService {
  constructor(
    @InjectModel(Paystack.name)
    private paystackModel: Model<Paystack>,
    private usersService: UsersService,
    private adminService: AdminService,
    private transactionService: TransactionService,
    private walletService: WalletService,
    private paymentService: PaymentService,
  ) {}

  private PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
  private PAYSTACK_URL = process.env.PAYSTACK_URL;

  private header = {
    headers: {
      Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
    },
  };

  async saveWebhook(req: Request): Promise<void> {
    try {
      const data = new this.paystackModel({ payload: req.body });
      await data.save();
    } catch (ex) {
      throw new InternalServerErrorException(ex.message);
    }
  }

  async saveWebhookPayment(req: Request): Promise<void> {
    try {

        console.log('📩 Webhook received:', req.body);
      const secret = this.PAYSTACK_SECRET_KEY;
      if (!secret) {
        throw new InternalServerErrorException(
          'PAYSTACK_SECRET_KEY is not defined',
        );
      }
      const signature = req.headers['x-paystack-signature'];

      const hash = crypto
        .createHmac('sha512', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash == signature) {
        await this.saveWebhook(req);

        if (req.body) {
          console.log('✅ Webhook triggered with event:', req.body);
        }


        //   if (req.body && req.body['event'] === 'dedicatedaccount.assign.success') {
        //     await this.usersService.setPaystackAccountInformation(
        //       req.body['data'],
        //     );
        //   }

        if (req.body && req.body['event'] === 'charge.success') {
          const response = await this.validatePayment(
            req.body['data']['reference'],
          );
          console.log(response);

          if (response.status && response.status === 'success') {
            if (response.metadata && response.metadata.adminId) {
              await this.createTransactionRecordAdmin(response);
            } else if (response.metadata && response.metadata.userId) {
              await this.createTransactionRecord(response);
            }
          }
        }
      }
    } catch (ex) {
      throw new InternalServerErrorException(ex.message);
    }
  }

  async generatePaymentLink(
    paymentDto: PaymentDto,
    userId?: string,
    adminId?: string,
  ): Promise<any> {
    try {
      let email: string = '';
      const metadata: { userId?: string; adminId?: string } = {};

      if (userId) {
        const user = await this.usersService.getUserById(userId);
        email = user?.data.email;
        metadata.userId = user?.data._id;
      }

      if (adminId) {
        const admin = await this.adminService.getUserById(adminId);
        email = admin?.data.email;
        metadata.adminId = admin?.data._id;
      }

      const payload = {
        email,
        amount: paymentDto.amount * 100,
        metadata,
      };

      const endpoint = PaystackEndpointEnum.InitiatePayment;
      const response = await this.fetchData(endpoint, payload);

      return response.data.data.authorization_url;
    } catch (ex) {
      const errorMessage =
        ex?.response?.data?.message ||
        ex.message ||
        'Payment link generation failed';

      throw new InternalServerErrorException(errorMessage);
    }
  }

  async validatePayment(transactionId: string): Promise<any> {
    try {
      const endpoint = PaystackEndpointEnum.VerifyTransaction;
      const response = await axios.get(
        `${this.PAYSTACK_URL}/${endpoint}/${transactionId}`,
        this.header,
      );
      return response.data.data;
    } catch (ex) {
      throw new InternalServerErrorException(ex.response.data.message);
    }
  }
  private async createTransactionRecord(response: any) {
    try {
      const userId = response.metadata.userId;

      const actualAmount = Number(response.amount) / 100;

      const reference = await this.paymentService.isReferenceDuplicated(
        response.reference,
      );

      if (!reference) {
        const user = await this.usersService.increaseWalletBalance(
          userId,
          actualAmount,
        );

        const paymentData = {
          amount: actualAmount,
          reference: response.reference,
          paymentGatewayResponse: response,
          userId: user.data._id,
        };

        const transactionCreditData = {
          userId: user.data._id,
          reference: response.reference,
          description: `Wallet funded with ₦${actualAmount}`,
          amount: actualAmount,
          status: TransactionStatus.SUCCESSFUL,
          paymentType: TransactionPaymentTypeEnum.Paystack,
          type: TransactionTypeEnum.Credit,
        };

        await Promise.all([
          this.paymentService.savePayment(paymentData),
          this.transactionService.create(transactionCreditData),
        ]);
      }
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async createTransactionRecordAdmin(response: any) {
    try {
    //   const adminId = response.metadata.adminId;

      console.log('🧾 createTransactionRecordAdmin triggered');

      const actualAmount = Number(response.amount) / 100;

      const reference = await this.paymentService.isReferenceDuplicated(
        response.reference,
      );

      if (!reference) {
        await this.walletService.fundSystemWallet(actualAmount);


        const paymentData = {
          amount: actualAmount,
          reference: response.reference,
          paymentGatewayResponse: response,
        };

        const transactionCreditData = {
        //   adminId: admin.data._id,
          reference: response.reference,
          description: `Wallet funded with #${actualAmount}`,
          amount: actualAmount,
          status: TransactionStatus.SUCCESSFUL,
          paymentType: TransactionPaymentTypeEnum.Paystack,
          type: TransactionTypeEnum.Credit,
        };

        await Promise.all([
          this.paymentService.savePayment(paymentData),
          this.transactionService.create(transactionCreditData),
        ]);
      }
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async fetchData(endpoint: string, payload: any) {
    return await axios.post(
      `${process.env.PAYSTACK_URL}/${endpoint}`,
      payload,
      this.header,
    );
  }
}
