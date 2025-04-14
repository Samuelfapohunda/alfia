import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError, verify } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config/env.config';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }

    const token = authHeader.split(' ')[1] || authHeader;

    try {
      const decoded = verify(token, JWT_SECRET);
      request.user = decoded;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Token has expired, please login again',
        );
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException(
          'You are not authorized to access this resource',
        );
      }
    }
  }
}
