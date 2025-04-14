import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditScore } from 'src/models/credit-score.model';
import { UsersService } from '../users/users.service';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { ZeehService } from '../zeeh/zeeh.service';

@Injectable()
export class CreditScoreService {
  constructor(
    @InjectModel(CreditScore.name)
    private readonly creditScoreModel: Model<CreditScore>,
    private readonly userService: UsersService,
    private readonly zeehService: ZeehService,
  ) {}

  async getCreditScore(userId: string): Promise<IServiceResponse> {
    let bvn: string;
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) throw new NotFoundException('User not found');
      bvn = user.data.bvn;

      const scoresData = await this.zeehService.getCreditScore(bvn);

      if (typeof scoresData === 'object') {
        const updatedCreditScore = await this.saveOrUpdateCreditScore(
          user.data._id,
          bvn,
          scoresData,
        );

        return {
          data: updatedCreditScore,
        };
      }

      return {
        data: null,
        message: 'Invalid credit score data received',
      };
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async saveOrUpdateCreditScore(
    userId: string,
    bvn: string,
    creditScoreData: any,
  ): Promise<CreditScore> {
    try {
      return await this.creditScoreModel
        .findOneAndUpdate(
          { userId, bvn },
          { data: creditScoreData },
          { new: true, upsert: true },
        )
        .populate('userId', 'firstName lastName email');
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
