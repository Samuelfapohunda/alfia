import { BillService } from './bill.service';
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
import { Hospital } from 'src/models/hospital.model';
import { HospitalGuard } from 'src/common/guards/hospital.guard';

@Controller('bill')
@ApiTags('Bill')
@ApiBearerAuth()
export class BillController {
  constructor(private readonly billService: BillService) {}

  @UseGuards(AuthGuard, HospitalGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new Bill for User.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Bill added successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bill already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(
    @Body() CreateBillDto: CreateBillDto,
    @Res() res: Response,
    @GetCurrentUserId() hospitalId: string,
    @Body('userId') userId: string,
  ) {
    const bill = await this.billService.createBill(
      hospitalId,
      userId,
      CreateBillDto,
    );
    return res.status(HttpStatus.CREATED).json({
      message: 'Bill Created successfully!',
      data: bill,
    });
  } 

  @UseGuards(AuthGuard, HospitalGuard)
    @Get('all')
    @ApiOperation({ summary: 'Get all Bills.' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Bills retrieved successfully',
    })
    @ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
    })
    async findAll(@Res() res: Response) {
      const bills = await this.billService.getAllBills();
      return res.status(HttpStatus.OK).json({
        message: 'Bills retrieved successfully!',
        data: bills,
      });
    }

    @UseGuards(AuthGuard, HospitalGuard)
    @Get(':billId')
    @ApiOperation({ summary: 'Get a single Bill.' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Bill retrieved successfully',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Bill not found',
    })
    @ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Internal server error',
    })
    async findOne(
      @Param('billId') billId: string,
      @Res() res: Response,
    ) {
      const bill = await this.billService.getBillById(billId);
      return res.status(HttpStatus.OK).json({
        message: 'Bill retrieved successfully!',
        data: bill,
      });
    }

    // @Patch(':billId')
    // @ApiOperation({ summary: 'Update a Bill.' })
    // @ApiResponse({
    //   status: HttpStatus.OK,
    //   description: 'Bill updated successfully',
    // })
    // @ApiResponse({
    //   status: HttpStatus.NOT_FOUND,
    //   description: 'Bill not found',
    // })
    // @ApiResponse({
    //   status: HttpStatus.INTERNAL_SERVER_ERROR,
    //   description: 'Internal server error',
    // })
    // async update(
    //   @Param('billId') billId: string,
    //   @Body() updateBillDto: CreateBillDto,
    //   @Res() res: Response,
    // ) {
    //   const bill = await this.billService.updateBillStatus(billId, updateBillDto);
    //   return res.status(HttpStatus.OK).json({
    //     message: 'Bill updated successfully!',
    //     data: bill,
    //   });
    // }

    // @Delete(':billId')
    // @ApiOperation({ summary: 'Delete a Bill.' })
    // @ApiResponse({
    //   status: HttpStatus.OK,
    //   description: 'Bill deleted successfully',
    // })
    // @ApiResponse({
    //   status: HttpStatus.NOT_FOUND,
    //   description: 'Bill not found',
    // })
    // @ApiResponse({
    //   status: HttpStatus.INTERNAL_SERVER_ERROR,
    //   description: 'Internal server error',
    // })
    // async remove(
    //   @Param('billId') billId: string,
    //   @Res() res: Response,
    // ) {
    //   const bill = await this.billService.deleteBill(billId);
    //   return res.status(HttpStatus.OK).json({
    //     message: 'Bill deleted successfully!',
    //     data: bill,
    //   });
    // }
}
