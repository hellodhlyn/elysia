import { Module } from '@nestjs/common';

import { PingController } from './controllers/ping.controller';
import { CryptoController } from './controllers/v1/crypto.controller';
import { ConverterService } from './services/crypto/converter.service';
import { ExchangeService } from './services/crypto/exchanges.service';

@Module({
  imports: [],
  controllers: [PingController, CryptoController],
  providers: [ConverterService, ExchangeService],
})
export class AppModule {}
