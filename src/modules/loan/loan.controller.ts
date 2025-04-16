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
import { LoanService } from './loan.service';

@Controller('loan')
@ApiTags('loan')
@ApiBearerAuth()
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

 
}
