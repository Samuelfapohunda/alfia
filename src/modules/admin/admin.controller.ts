import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AdminService } from './admin.service';
import {
  ForgotPasswordDto,
  InviteAdminDto,
  ChangeAdminPasswordDto,
  createSuperAdminDto,
} from '../../common/dto/admin.dto';
import { LoginDto } from 'src/common/dto/auth.dto';
import { AdminGuard, SuperAdminGuard } from '../../common/guards/admin.guard';
import { GetCurrentUserId } from 'src/common/decorators/getCurrentUser.decorator';
import { ObjectId } from 'mongoose';

@Controller('admin')
@ApiTags('Admin')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('super-admin-register')
  @ApiOperation({ summary: 'Register a new Super Admin.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Super Admin added successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Super Admin already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async registerSuperAdmin(
    @Request() req,
    @Res() res: Response,
    @Body() createSuperAdminDto: createSuperAdminDto,
  ) {
    const admin =
      await this.adminService.registerSuperAdmin(createSuperAdminDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Super Admin added successfully!',
      data: admin,
    });
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate an admin user.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin logged in successfully',
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
    const serviceResponse = await this.adminService.login(body);

    let message = 'Admin logged in successfully!';
    if (serviceResponse.data?.user?.isPasswordChanged === false) {
      message = 'Login successful. User needs to change their password.';
    }

    return res.status(HttpStatus.OK).json({
      message,
      admin: serviceResponse.data,
    });
  }

  @UseGuards(AuthGuard, SuperAdminGuard)
  @ApiOperation({ summary: 'Invite a new admin user.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Admin already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Post('invite')
  async inviteAdmin(
    @Res() res: Response,
    @Body() createAdminDto: InviteAdminDto,
  ) {
    const admin = await this.adminService.inviteAdmin(createAdminDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Admin created successfully!',
      admin,
    });
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get('one/:id')
  @ApiOperation({ summary: 'Retrieve admin details by ID.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the admin to retrieve',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async getAdminById(
    @Request() req,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const admin = await this.adminService.findAdminById(id);
    return res.status(HttpStatus.OK).json({
      message: 'Admin retrieved successfully',
      admin,
    });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate password recovery for an admin.' })
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
    await this.adminService.forgotPassword(forgotPasswordDto);
    return res.status(HttpStatus.OK).json({
      message: 'Email sent successfully!',
    });
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @ApiOperation({ summary: 'Change admin user’s password.' })
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
    @Body() resetAdminPasswordDto: ChangeAdminPasswordDto,
    @GetCurrentUserId() adminId: string,
  ) {
    await this.adminService.resetPassword(adminId, resetAdminPasswordDto);
    return res.status(HttpStatus.OK).json({
      message: 'Password changed successfully!',
    });
  }

  @UseGuards(AuthGuard, AdminGuard) 
  @Get('all-users')
  @ApiOperation({ summary: 'Retrieve all users with counts' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of users per page',
    default: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getAllUsersWithCounts(
    @Request() req,
    @Res() res: Response,
    @Query() query,
  ) {
    const limit = query.limit ? parseInt(query.limit) : 10;
    const page = query.page ? parseInt(query.page) : 1;
    const skip = (page - 1) * limit;

    const result = await this.adminService.getAllUsersWithCounts(skip, limit);

    return res.status(HttpStatus.OK).json({
      message: 'Users retrieved successfully',
      totalPages: Math.ceil(result.data.counts.total / limit),
      currentPage: page,
      counts: result.data.counts,
      users: result.data.users,
    });
  }

  // @UseGuards(AuthGuard, AdminGuard, SuperAdminGuard)
  @UseGuards(AuthGuard, AdminGuard)
  @Get('all-admins')
  @ApiOperation({ summary: 'Retrieve all admins in the system with count.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    default: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of admins per page',
    default: 10,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admins retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getAllAdmins(
    @Request() req,
    @Res() res: Response,
    @GetCurrentUserId() adminId: string,
    @Query() query,
  ) {
    const limit = 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const search = query.search ? query.search : '';

    const admins = await this.adminService.getAllAdmins(
      skip,
      limit,
      search,
      adminId,
    );
    const count = await this.adminService.countAllAdmins(search, adminId);

    return res.status(HttpStatus.OK).json({
      message: 'Admins retrieved successfully',
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      count: count,
      admins,
    });
  }


  @UseGuards(AuthGuard, AdminGuard)
  @Get('users/:userId')
  @ApiOperation({ summary: 'Retrieve user details by ID.' })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user to retrieve',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async getUserById(
    @Request() req,
    @Res() res: Response,
    @Param('userId') userId: string,
  ) {
    const user = await this.adminService.getUserById(userId);
    return res.status(HttpStatus.OK).json({
      message: 'User retrieved successfully',
      user,
    });
  }


  @UseGuards(AuthGuard, SuperAdminGuard)
  @Post(':adminId/revoke-access')
  @ApiOperation({ summary: 'Revoke Admin Access.' })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin to revoke access',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin access revoked successfully',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async revokeAdminAccess(
    @Request() req,
    @Res() res: Response,
    @Param('adminId') adminId: string,
  ) {
    await this.adminService.revokeAdminAccess(adminId);
    return res.status(HttpStatus.OK).json({
      message: 'Admin access revoked successfully',
    });
  }

  @UseGuards(AuthGuard, SuperAdminGuard)
  @Post(':adminId/restore-access')
  @ApiOperation({ summary: 'Restore Admin Access.' })
  @ApiParam({
    name: 'adminId',
    description: 'ID of the admin to restore access',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin access restored successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @HttpCode(HttpStatus.OK)
  async restoreAdminAccess(
    @Request() req,
    @Res() res: Response,
    @Param('adminId') adminId: string,
  ) {
    await this.adminService.restoreAdminAccess(adminId);
    return res.status(HttpStatus.OK).json({
      message: 'Admin access restored successfully',
    });
  }


  @UseGuards(AuthGuard, SuperAdminGuard)
  @Get('pending-hospitals')
  @ApiOperation({ summary: 'Get hospitals pending approval' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns list of unverified hospitals' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Internal server error' 
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10, max: 100)',
    example: 10
  })
  async getPendingHospitals(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
      return await this.adminService.getPendingHospitalsToBeApproved(
        (page - 1) * limit,
        limit
      );
    }
  

@UseGuards(AuthGuard, SuperAdminGuard)
@Post('approve/:hospitalId')
@ApiOperation({ summary: 'Approve a hospital.' })
@ApiParam({
  name: 'hospitalId',
  description: 'ID of the hospital to approve',
})
@ApiResponse({
  status: HttpStatus.OK,
  description: 'Hospital approved successfully',
})
@ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Hospital not found',
})
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: 'Internal server error',
})

async approveHospital(
  @Request() req,
  @Res() res: Response,
  @Param('hospitalId') hospitalId: string,
  @GetCurrentUserId() adminId: string,
) {
  await this.adminService.approveHospital(adminId, hospitalId);
  return res.status(HttpStatus.OK).json({
    message: 'Hospital approved successfully',
  });
}
} 
