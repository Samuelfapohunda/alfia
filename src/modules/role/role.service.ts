import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { RoleDto } from 'src/common/dto/role.dto';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { Role } from 'src/models/role.model';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async create(roleDto: RoleDto): Promise<IServiceResponse> {
    try {
      const newRole = new this.roleModel({
        ...roleDto,
      });
     const role = await newRole.save();
      return {
        data: role,
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<IServiceResponse> {
    try {
        const role = await this.roleModel.find().exec();
      return {
        data: role
      }
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: string): Promise<IServiceResponse> {
    try {
      const role = await this.roleModel.findById(id).exec();
      return {
        data: role
      }
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
