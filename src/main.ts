import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cors 추가
  app.enableCors({
    origin: ['https://dangder.shop'],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
