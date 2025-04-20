import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ObjectId } from 'mongoose';
import { TransactionService } from './transaction.service';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUser.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(AuthGuard)
  @Get('all')
  async getTansactions(@Request() req, @Res() res: Response, @Query() query, @GetCurrentUserId() userId: string,) {
    const { limit = 10, page = 1, status = '', search = '' } = query;
    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * limit;


    const transactions = await this.transactionService.findAll(
      userId,
      skip,
      limit,
      search,
      status,
    );

    const count = await this.transactionService.countAll(
      userId,
      search,
      status,
    );

    return res.status(HttpStatus.OK).json({
      totalPages: Math.ceil(count / limit),
      currentPage: pageNumber,
      count: count,
      data: transactions,
    });
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get('all/:userId')
  async getTransactionsAdmin(
    @Request() req,
    @Res() res: Response,
    @Query() query,
    @Param('userId') userId: string,
  ) {
    const { limit = 10, page = 1, status = '', search = '' } = query;
    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * limit;

    const transactions = await this.transactionService.findAll(
      userId,
      skip,
      limit,
      search,
      status,
    );

    const count = await this.transactionService.countAll(
      userId,
      search,
      status,
    );

    return res.status(HttpStatus.OK).json({
      totalPages: Math.ceil(count / limit),
      currentPage: pageNumber,
      count: count,
      data: transactions,
    });
  }

  @UseGuards(AuthGuard)
  @Get('reference/:reference')
  async findByReference(
    @Request() req,
    @Res() res: Response,
    @Param('reference') reference: string,
    @GetCurrentUserId() userId: string
  ) {
    const transaction = await this.transactionService.findByReference(
      userId,
      reference,
    );
    return res.status(HttpStatus.OK).json({
      data: transaction,
    });
  }

  @UseGuards(AuthGuard)
  @Get('one/:id')
  async findById(@Res() res: Response, @Param('id') id: string) {
    const transaction = await this.transactionService.findById(id);
    return res.status(HttpStatus.OK).json({
      message: 'Transaction retrieved successfully',
      data: transaction,
    });
  }
}
