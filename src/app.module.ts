import { Module } from '@nestjs/common';

import { CryptoController } from './controllers/v1/crypto.controller';
import { CryptoMarketService, CryptoConverterService } from './services/crypto.service';

@Module({
  imports: [],
  controllers: [CryptoController],
  providers: [CryptoConverterService, CryptoMarketService],
})
export class AppModule {}
