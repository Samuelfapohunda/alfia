const SWAGGER_API_ROOT = 'docs';
const SWAGGER_API_NAME = 'Alfia API Documentation';
const SWAGGER_API_DESCRIPTION = 'API documentation for Alfia';
const SWAGGER_API_CURRENT_VERSION = '1.0';

import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const globalPrefix = 'api/v1';
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  document.paths = Object.fromEntries(
    Object.entries(document.paths).map(([path, value]) => [
      `/${globalPrefix}${path}`,
      value,
    ]), 
  );

  document.tags = [
    {
      name: 'Auth',
      description: 'Endpoints for user authentication and account management.',
    },
    {
      name: 'User',
      description: 'Endpoints for user account management.',
    },
    {
      name: 'Hospital',
      description: 'Endpoints for managing hospitals.',
    },
    {
      name: 'Role',
      description: 'Endpoints for managing roles within the system.',
    },
    {
      name: 'Admin',
      description:
        'Administrative endpoints for managing users, roles, and system settings.',
    },
    {
      name: 'Bill',
      description: 'Bill management endpoints for users.',
    },
    {
      name: 'Credit-Request',
      description: 'Endpoints for managing credit requests.',
    },
    {
      name: 'Loan',
      description: 'Endpoints for managing loans.',
    },
    {
      name: 'Credit-score',
      description: 'Endpoints for managing credit scores.',
    },
    {
      name: 'Zeeh',
      description: 'Endpoints for managing Zeeh integration.',
    },
  ];

  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);
};
