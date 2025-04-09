import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleService } from './role.service';
import { RoleDto } from 'src/common/dto/role.dto';
import { SuperAdminGuard } from 'src/common/guards/admin.guard';
import { ObjectId } from 'mongoose';

@Controller('role')
@ApiTags('Role')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all roles.' })
  @HttpCode(HttpStatus.OK)
  async getAllRoles(@Request() req, @Res() res: Response) {
    const roles = await this.roleService.findAll();
    return res.status(HttpStatus.OK).json({
      message: 'Roles retrieved successfully',
      data: roles,
    });
  }

  @Post('create')
  @UseGuards(SuperAdminGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new role.' })
  async createRole(
    @Request() req,
    @Res() res: Response,
    @Body() roleDto: RoleDto,
  ) {
    const role = await this.roleService.create(roleDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Role added successfully!',
      data: role,
    });
  }

  @Post('one/:id')
  @ApiOperation({ summary: 'Retrieve role details by role ID.' })
  @HttpCode(HttpStatus.OK)
  async getRoleById(
    @Request() req,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const role = await this.roleService.findById(id);
    return res.status(HttpStatus.OK).json({
      message: 'Role retrieved successfully',
      data: role,
    });
  }
}
