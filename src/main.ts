import { NestFactory } from '@nestjs/core';
import Decimal from 'decimal.js';

import { AppModule } from './app.module';

async function bootstrap() {
  Decimal.set({ precision: 9999 });

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ELYSIA_CORS_ORIGIN || 'http://127.0.0.1:8080',
  });

  await app.listen(3000);
}
bootstrap();
