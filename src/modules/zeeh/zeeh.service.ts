import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import axios from 'axios';
import { EnvironmentEnum } from './enum/zeeh.enum';
import { CreditReportsEndpointEnum } from './enum/zeeh.enum';
import { fc_score_data } from './sandbox-data';

@Injectable()
export class ZeehService {
  private ZEEH_URL = process.env.ZEEH_URL;

  private header = {
    headers: {
      Secret_Key: process.env.ZEEH_SECRET_KEY,
    },
  };

  async getCreditScore(bvn: string) {
    const payload = { bvn };
    const endpoint = `credit_reports/${CreditReportsEndpointEnum.fc_credit_score}`;
    return this.fetchCreditData(endpoint, payload, fc_score_data);
  }

  private async fetchData(endpoint: string, payload: any) {
    return await axios.post(
      `${this.ZEEH_URL}/${endpoint}`,  
      payload,
      this.header,
    );
  }

  async fetchCreditData(endpoint: string, payload: object, mockData: any) {
    try {
      if (process.env.NODE_ENV !== EnvironmentEnum.Production) return mockData;

      const response = await this.fetchData(endpoint, payload);

      if (
        response.data.statusCode === 200 &&
        typeof response.data.data === 'object'
      ) {
        return response.data.data;
      }
    } catch (ex) {
      throw new HttpException(ex.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
