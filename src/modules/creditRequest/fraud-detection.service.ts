import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
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

    await this.cacheManager.set('test-key', 1, 60);
    const value = await this.cacheManager.get('test-key');
    console.log('[Redis Test] test-key:', value);
    const bill = await this.billModel.findById(billId);
    if (!bill) return flags;

    console.log(`Checking fraud for hospital: ${bill.hospitalId}`);

    const now = Date.now();
    const userKey = `credit_req_user:${userId}`;
    const hospitalKey = `credit_req_hospital:${bill.hospitalId}`;

    const userCount = await this.incrementAndGetCount(userKey, 60);
    const hospitalCount = await this.incrementAndGetCount(hospitalKey, 60);

    console.log(`User count: ${userCount}, Hospital count: ${hospitalCount}`);

    if (userCount > 3) {
      flags.push('User sent multiple requests in short time');
    }

    if (hospitalCount > 2) {
      flags.push('Hospital sending too many credit requests quickly');
    }

    const allRequests = await this.creditRequestModel.find();
    const avgAmount =
      allRequests.reduce((sum, r) => sum + (r.amountRequested || 0), 0) /
      Math.max(allRequests.length, 1);

    if (bill.totalAmount > avgAmount * 2) {
      flags.push('Unusually large loan request');
    }

    return flags;
  }
  private async incrementAndGetCount(
    key: string,
    ttl: number,
  ): Promise<number> {
    const current = (await this.cacheManager.get<number>(key)) || 0;
    const updated = current + 1;
    await this.cacheManager.set(key, updated, ttl);
    return updated;
  }
}
