import { Controller, Get } from '@nestjs/common';

import { CryptoMarketService, CryptoConverterService } from '../../services/crypto.service';
import { CurrencyResponse } from '../../dto/crypto.dto';

@Controller('/v1/crypto')
export class CryptoController {
  constructor(
    private readonly marketService: CryptoMarketService,
    private readonly converterService: CryptoConverterService,
  ) {}

  @Get('/currencies')
  async getCurrencies() {
    const markets = await this.marketService.markets();
    return markets.map((market) => CurrencyResponse.fromCcxtMarket(market));
  }

  @Get('/converted_price')
  async getConvertedPrice() {
    await this.marketService.markets();
    return CryptoConverterService.convertPrice(1, 'CPT', 'USDT');
  }
}
