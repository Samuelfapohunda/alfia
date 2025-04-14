import {
    BadRequestException,
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as argon2 from 'argon2';
  import { Model, ObjectId } from 'mongoose';
import { IServiceResponse } from 'src/common/interfaces/http-response.interface';
import { User } from 'src/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Helpers } from 'src/common/helpers';

@Injectable()
export class UsersService {
   constructor(
    @InjectModel(User.name) private userModel: Model<User>,
   ) {}


   
  async getUserById(userId: string): Promise<IServiceResponse> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return {
        data: user,
      };
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

    
}
