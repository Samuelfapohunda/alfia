import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Request,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateBillDto } from 'src/common/dto/bill.dto';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { CreditScoreService } from './credit-score.service';

@Controller('credit-score')
@ApiTags('Credit-score')
@ApiBearerAuth()
export class CreditScoreController {
  constructor(private readonly creditScoreService: CreditScoreService) {}

  @UseGuards(AuthGuard, AdminGuard)
  @Get(':userId')
  async getCreditScore(
    @Request() req,
    @Res() res: Response,
    @Param('userId') userId: string,
  ) {
    const data = await this.creditScoreService.getCreditScore(userId);
    return res.status(HttpStatus.CREATED).json({
      message: 'User Credit Score retrieved successfully!',
      data,
    });
  }
}
