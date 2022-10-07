import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';

// 에러메시지 로그를 위한 import
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress()); // graphql upload 이용하기위한 추가
  // Cors 추가
  app.enableCors({
    origin: process.env.CORS_URLS.split(', '),
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
