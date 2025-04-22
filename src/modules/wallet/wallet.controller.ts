import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Request,
  Res,
  UseGuards,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AdminGuard, SuperAdminGuard } from 'src/common/guards/admin.guard';
import { WalletService } from './wallet.service';
import { PaymentDto } from 'src/common/dto/paystack.dto';
import { PaystackService } from '../paystack/paystack.service';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUser.decorator';

@Controller('wallet')
@ApiTags('wallet')
@ApiBearerAuth()
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly paystackService: PaystackService,
  ) {}

  @UseGuards(AuthGuard, SuperAdminGuard)
  @Post('fund')
  async fundSystemWallet(
    @Request() req,
    @Body() dto: PaymentDto,
    @Res() res: Response,
    @GetCurrentUserId() adminId: string,
  ) {
    const paymentLink = await this.paystackService.generatePaymentLink(
      { amount: dto.amount },
      undefined,
      adminId,
    );

    return res.status(HttpStatus.OK).json({
      message: 'Payment link generated successfully',
      data: paymentLink,
    });
  }
}
