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
import { HospitalService } from './hospital.service';
import {
  ChangeHospitalPasswordDto,
  CreateHospitalDto,
  ForgotPasswordDto,
  LoginDto,
  UpdateHospitalDto,
} from 'src/common/dto/hospital.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUser.decorator';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('hospitals')
@ApiTags('Hospital')
@ApiBearerAuth()
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}


  
  @Post('create')
  @ApiOperation({ summary: 'Add a new Hospital.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Hospital added successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Hospital already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(
    @Body() createHospitalDto: CreateHospitalDto,
    @Res() res: Response,
  ) {
    const hospital =
      await this.hospitalService.createHospital(createHospitalDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Hospital Created successfully!',
      data: hospital,
    });
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get('all')
  @ApiOperation({ summary: 'Get All Hospitals' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Hospital retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Hospital not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAllHospital(@Res() res: Response) {
    const hospital = await this.hospitalService.findAllHospitals();
    return res.status(HttpStatus.CREATED).json({
      message: 'Hospitals retrieved successfully!',
      data: hospital,
    });
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get('one/:id')
  @ApiOperation({ summary: 'Get Single Hospital' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Hospital retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Hospital not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findOneHospital(@Param('id') id: string, @Res() res: Response) {
    const hospital = await this.hospitalService.findHospitalById(id);
    return res.status(HttpStatus.CREATED).json({
      message: 'Hospital retrieved successfully!',
      data: hospital,
    });
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Patch('one/:id')
  async updateHospital(
    @Param('id') id: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
    @Res() res: Response,
  ) {
    const hospital = await this.hospitalService.updateHospital(
      id,
      updateHospitalDto,
    );
    return res.status(HttpStatus.CREATED).json({
      message: 'Hospital updated successfully!',
      data: hospital,
    });
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Delete('one/:id')
  @ApiOperation({ summary: 'Delete Hospital' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Hospital deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Hospital not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async deleteHospital(@Param('id') id: string, @Res() res: Response) {
    const hospital = await this.hospitalService.deleteHospital(id);
    return res.status(HttpStatus.CREATED).json({
      message: 'Hospital Created successfully!',
      data: hospital,
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate a hospital.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Hospital logged in successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async login(@Request() req, @Res() res: Response, @Body() body: LoginDto) {
    const serviceResponse = await this.hospitalService.login(body);

    let message = 'Hospital logged in successfully!';
    if (serviceResponse.data?.hospital?.isPasswordChanged === false) {
      message = 'Login successful. Hospital needs to change their password.';
    }

    return res.status(HttpStatus.OK).json({
      message,
      hospital: serviceResponse.data,
    });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate password recovery for hospital.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid email',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async forgotPassword(
    @Res() res: Response,
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    await this.hospitalService.forgotPassword(forgotPasswordDto);
    return res.status(HttpStatus.OK).json({
      message: 'Email sent successfully!',
    });
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @ApiOperation({ summary: 'Change  hospital’s password.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async resetPassword(
    @Request() req,
    @Res() res: Response,
    @Body() resetHospitalPasswordDto: ChangeHospitalPasswordDto,
    @GetCurrentUserId() hospitalId: string,
  ) {
    await this.hospitalService.resetPassword(
      hospitalId,
      resetHospitalPasswordDto,
    );
    return res.status(HttpStatus.OK).json({
      message: 'Password changed successfully!',
    });
  }
}
