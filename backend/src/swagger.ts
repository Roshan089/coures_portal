import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * Swagger Configuration
 * 
 * This function sets up Swagger/OpenAPI documentation for the application.
 * Access the API documentation at: http://localhost:3000/api
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Course Portal API')
    .setDescription('API documentation for Course Portal application')
    .setVersion('1.0')
    .addTag('users', 'User management endpoints')
    .addTag('courses', 'Course management endpoints')
    .addTag('enrollments', 'Enrollment management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addServer('http://localhost:3000', 'Development server')
    .addServer('https://api.courseportal.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep authorization token after page refresh
      tagsSorter: 'alpha', // Sort tags alphabetically
      operationsSorter: 'alpha', // Sort operations alphabetically
    },
    customSiteTitle: 'Course Portal API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 20px 0; }
    `,
  });
}
