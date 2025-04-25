import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Model } from 'mongoose';
import { Bill } from 'src/models/bill.model';
import { CreditRequest } from 'src/models/credit-request.model';

@Injectable()
export class FraudDetectionService {
  constructor(
    @InjectModel(CreditRequest.name)
    private readonly creditRequestModel: Model<CreditRequest>,
    @InjectModel(Bill.name)
    private readonly billModel: Model<Bill>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async detectFraud(billId: string, userId: string): Promise<string[]> {
    const flags: string[] = [];
    const bill = await this.billModel.findById(billId);
    if (!bill) return flags;

    console.log(`[Fraud Check] Bill: ${billId}, Hospital: ${bill.hospitalId}, User: ${userId}`);

    const userKey = `credit_req_user:${userId}`;
    const hospitalKey = `credit_req_hospital:${bill.hospitalId}`;
    const windowSeconds = 60;

    const userRequestCount = await this.incrementRequestCount(userKey, windowSeconds);
    const hospitalRequestCount = await this.incrementRequestCount(hospitalKey, windowSeconds);

    console.log(`[Request Counts] User: ${userRequestCount}, Hospital: ${hospitalRequestCount}`);

    if (userRequestCount >= 3) {
      flags.push('User sent multiple requests in short time');
    }

    if (hospitalRequestCount >= 3) {
      flags.push('Hospital sending too many credit requests quickly');
    }

    const avgAmount = await this.getAverageRequestAmount();
    if (bill.totalAmount > avgAmount * 2) {
      flags.push('Unusually large loan request');
    }

    if (flags.length > 0) {
      const response = {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'FRAUD_DETECTED',
        flags,
        counts: {
          user: userRequestCount,
          hospital: hospitalRequestCount,
        },
        averageAmount: avgAmount,
        currentAmount: bill.totalAmount,
        timestamp: new Date().toISOString()
      };
      
      console.log('Fraud Block Response:', response);
      throw new HttpException(response, HttpStatus.TOO_MANY_REQUESTS);
    }
    return flags;
  }

  private async getAverageRequestAmount(): Promise<number> {
    const result = await this.creditRequestModel.aggregate([
      {
        $group: {
          _id: null,
          avgAmount: { $avg: '$amountRequested' },
        },
      },
    ]);
    return result[0]?.avgAmount || 0;
  }

  private async incrementRequestCount(key: string, ttl: number): Promise<number> {
    try {
      const current = await this.cacheManager.get<number>(key);
      
     
      if (current === undefined) {
        await this.cacheManager.set(key, 1, ttl * 1000);
        return 1;
      }
      
      const newCount = (current ?? 0) + 1;
      await this.cacheManager.set(key, newCount);
      return newCount;
    } catch (error) {
      console.error('Cache operation failed:', error);
      throw new HttpException(
        'Failed to process request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}