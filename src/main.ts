import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.YURI_CORS_ORIGIN || 'http://127.0.0.1:8080',
  });

  await app.listen(3000);
}
bootstrap();
