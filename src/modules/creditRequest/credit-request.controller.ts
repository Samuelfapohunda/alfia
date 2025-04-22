import { CreditRequestService } from './credit-request.service';
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  Request,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateBillDto } from 'src/common/dto/bill.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUser.decorator';
import { CreateCreditRequestDto } from 'src/common/dto/credit-request.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { HospitalGuard } from 'src/common/guards/hospital.guard';
import { CreditRequestStatus } from 'src/common/enums/credit-request.enum';

@Controller('credit-request')
@ApiTags('Credit-Request')
@ApiBearerAuth()
export class CreditRequestController {
  constructor(private readonly creditRequestService: CreditRequestService) {}

  @UseGuards(AuthGuard, HospitalGuard)
  @Post('create/:billId')
  @ApiOperation({ summary: 'Create New Credit Request' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credit Request created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Pending Credit Request already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async createCreditRequest(
    @Request() req,
    @Res() res: Response,
    @Param('billId') billId: string,
    @Body() creditRequestDto: CreateCreditRequestDto,
  ) {
    const creditRequest = await this.creditRequestService.create(
      billId,
      creditRequestDto,
    );

    return res.status(HttpStatus.CREATED).json({
      message: 'Credit Request created successfully!',
      data: creditRequest,
    });
  }

//   @UseGuards(AuthGuard, AdminGuard)
//   @Get('all')
//   async getCreditRequest(
//     @Request() req,
//     @Res() res: Response,
//     @Query() query,
//     @Param() billId: string,
//   ) {
//     const { limit = 10, page = 1, status = '', search = '' } = query;
//     const pageNumber = Number(page);
//     const skip = (pageNumber - 1) * limit;

//     const creditRequests = await this.creditRequestService.findAll(
//       skip,
//       limit,
//       status,
//       search,
//     );
//     const count = await this.creditRequestService.countAll(status, search);

//     return res.status(HttpStatus.OK).json({
//       message: 'All credit requests retrieved successfully!',
//       totalPages: Math.ceil(count / limit),
//       currentPage: pageNumber,
//       count: count,
//       data: creditRequests,
//     });
//   }

  @UseGuards(AuthGuard, HospitalGuard)
  @Get('all/:userId')
  async getUserCreditRequest(
    @Request() req,
    @Res() res: Response,
    @Param('userId') userId: string,
  ) {
    const creditRequests =
      await this.creditRequestService.getUserCreditRequests(userId);

    return res.status(HttpStatus.OK).json({
      message: 'All user credit requests retrieved successfully!',
      data: creditRequests,
    });
  }

  @Get('admin/all')
  @UseGuards(AuthGuard, AdminGuard)
  async getAllCreditRequest(@Res() res: Response, @Query() query) {
    const { limit = 10, page = 1, status = '', search = '' } = query;
    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * limit;

    const creditRequests = await this.creditRequestService.findAll(
      skip,
      limit,
      search,
      status,
    );
    const count = await this.creditRequestService.countAll(search, status);

    return res.status(HttpStatus.OK).json({
      message: 'All credit requests retrieved successfully!',
      totalPages: Math.ceil(count / limit),
      currentPage: pageNumber,
      count: count,
      data: creditRequests,
    });
  }

  @Get('one/:id')
  async getOneCreditRequest(@Res() res: Response, @Param('id') id: string) {
    const creditRequest = await this.creditRequestService.findById(id);
    return res.status(HttpStatus.OK).json({
      message: 'Credit Request retrieved successfully',
      data: creditRequest,
    });
  }

  
  @UseGuards(AuthGuard, AdminGuard)
  @Post('resolve/:creditRequestId')
  async processCreditRequest(
    @Request() req,
    @Res() res: Response,
    @Param('creditRequestId') creditRequestId: string,
    @GetCurrentUserId() adminId: string,
  ) {
    const creditRequest = await this.creditRequestService.processCreditRequest(
      creditRequestId,
      adminId,
    );
    return res.status(HttpStatus.OK).json({
      message: 'Credit Request resolved successfully',
      data: creditRequest,
    });
  }

} 
