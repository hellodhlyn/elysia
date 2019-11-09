import { Controller, Get, Query } from '@nestjs/common';
import { upbit } from 'ccxt';

import { CurrencyResponse } from '../../dto/crypto.dto';
import { ConverterService } from '../../services/crypto/converter.service';
import { ExchangeService } from '../../services/crypto/exchanges.service';

@Controller('/v1/crypto')
export class CryptoController {
  private readonly exchangeClient = ExchangeService.of(new upbit());

  constructor(private readonly converterService: ConverterService) {}

  @Get('/currencies')
  async getCurrencies() {
    const currencies = await this.exchangeClient.currencies();
    return currencies.map((currency) => CurrencyResponse.fromCcxtMarket(currency));
  }

  @Get('/converted_price')
  async getConvertedPrice(
    @Query('price') price: number,
    @Query('currencyFrom') from: string,
    @Query('currencyTo') to: string,
  ) {
    return await this.converterService.convertPrice(price, from, to);
  }
}
