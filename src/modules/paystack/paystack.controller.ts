import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Request,
    Res,
    UseGuards,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { ObjectId } from 'mongoose';
  import { PaymentDto } from '../../common/dto/paystack.dto';
  import { PaystackService } from './paystack.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
  
  @Controller('paystack')
  export class PaystackController {
    constructor(private readonly paystackService: PaystackService) {}
  
    @Post('webhook')
    async handleWebhook(@Request() req, @Res() res: Response) {
      await this.paystackService.saveWebhookPayment(req);
      res.sendStatus(200);
    }
  
    // @UseGuards(JwtAuthGuard)
    // @Post('generate-payment-link')
    // async generatePaymentLink(
    //   @Request() req,
    //   @Res() res: Response,
    //   @Body() paymentDto: PaymentDto,
    // ) {
    //   const userId: ObjectId = req.user._id;
    //   const paymentLink = await this.paystackService.generatePaymentLink(
    //     paymentDto,
    //     userId,
    //   );
  
    //   return res.status(HttpStatus.OK).json({
    //     data: paymentLink,
    //   });
    // }
  
    // @UseGuards(JwtAuthGuard, MerchantGuard)
    // @Post('generate-payment-link-merchant')
    // async generatePaymentLinkMerchant(
    //   @Request() req,
    //   @Res() res: Response,
    //   @Body() paymentDto: PaymentDto,
    // ) {
    //   const merchantId: ObjectId = req.user._id;
    //   const paymentLink = await this.paystackService.generatePaymentLink(
    //     paymentDto,
    //     null,
    //     merchantId,
    //   );
  
    //   return res.status(HttpStatus.OK).json({
    //     data: paymentLink,
    //   });
    // }
  
    @UseGuards(AuthGuard)
    @Get('validate-payment/:transactionId')
    async validatePayment(
      @Res() res: Response,
      @Param('transactionId') transactionId: string,
    ) {
      const paymentResponse =
        await this.paystackService.validatePayment(transactionId);
  
      return res.status(HttpStatus.OK).json({
        message: 'Payment validated successfully!',
        data: paymentResponse,
      });
    }
  }
  