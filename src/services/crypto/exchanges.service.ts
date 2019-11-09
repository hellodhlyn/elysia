import { Injectable } from '@nestjs/common';
import { Exchange, Market, Ticker, Currency, Dictionary } from 'ccxt';

import { cacheGet } from '../../../lib/cache';

class ExchangeClient {
  constructor(private readonly client: Exchange) {}

  private async loadMarkets(): Promise<Dictionary<Market>> {
    return await cacheGet<Promise<Dictionary<Market>>>('crpyto:exchanges:markets', 60, () => {
      return this.client.loadMarkets();
    });
  }

  async markets(): Promise<Market[]> {
    const marketDict = await this.loadMarkets();
    return Object.keys(marketDict).map(marketId => marketDict[marketId]);
  }

  async currencies(): Promise<Currency[]> {
    await this.loadMarkets();
    const curDict = await cacheGet<Promise<Dictionary<Currency>>>('crypto:exchanges:currencies', 60, () => {
      return this.client.fetchCurrencies();
    });
    return Object.keys(curDict).map((curId) => curDict[curId]);
  }

  async ticker(marketId: string): Promise<Ticker> {
    await this.loadMarkets();
    return await cacheGet<Promise<Ticker>>(`crypto:exchanges:ticker:${marketId}`, 10, () => {
      return this.client.fetchTicker(marketId);
    });
  }
}

@Injectable()
export class ExchangeService {
  static of(exchange: Exchange): ExchangeClient {
    return new ExchangeClient(exchange);
  }
}
