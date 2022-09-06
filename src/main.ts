import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress()); // graphql upload 이용하기위한 추가
  // Cors 추가
  app.enableCors({
    origin: ['https://dangder.shop', 'http://localhost:3000'],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
