import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { PrismaExceptionFilter } from './exceptions/prisma-exception-filter';
import { ResponseInterceptor } from './interceptors/reponse.interceptor';
import { join } from 'path';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.setGlobalPrefix('api/v1');

  const uploadsPath =
    process.env.NODE_ENV === 'production'
      ? join(__dirname, 'uploads') // dist/uploads
      : join(__dirname, '..', 'uploads'); // project/uploads

  app.useStaticAssets(uploadsPath, { prefix: '/uploads' });

  app.enableCors();

  // 🔥 Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('API documentation for My Blog — Blog sharing platform.')
    .setVersion('1.0.0')
    .addBearerAuth() // 👈 thêm nút Authorize (JWT)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT || 3000}`,
  );
  console.log(
    `📘 Swagger Docs: http://localhost:${process.env.PORT || 3000}/api/docs`,
  );
}
bootstrap();
