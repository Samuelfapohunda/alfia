// import './instrument';
import {
  VersioningType,
  RequestMethod,
  ValidationPipe,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ValidationError } from 'class-validator';
import { corsConfig } from './config/cors.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsConfig);
  app.useGlobalPipes(
    new ValidationPipe({  
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const allErrors = validationErrors
          .map((error) => {
            if (error.constraints) {
              return Object.values(error.constraints);
            }
            return []; 
          })
          .flat();
  
        return new BadRequestException({
          message: allErrors,
        });
      },
    }),
  );
  
  setupSwagger(app);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('/api/v1', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        if (validationErrors[0]?.constraints) {
          return new BadRequestException({
            message: Object.values(validationErrors[0].constraints).join(', '),
            error: 'Bad Request',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }
  
        return new BadRequestException({
          message: 'Invalid input',
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      },
    }),
  );
  

  app.getHttpAdapter().get('/', (_, res) => {
    res.status(200).send({
      message: 'Service is live!',
    });
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
