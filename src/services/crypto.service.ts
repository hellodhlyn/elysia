import { Injectable } from '@nestjs/common';
import { upbit, Market, Ticker } from 'ccxt';

@Injectable()
export class CryptoMarketService {
  private upbitClient: upbit;

  constructor() {
    this.upbitClient = new upbit();
  }

  async markets(): Promise<Market[]> {
    await this.loadMarkets();
    const markets = [];
    for (const marketId of Object.keys(this.upbitClient.markets)) {
      markets.push(this.upbitClient.markets[marketId]);
    }
    return markets;
  }

  async ticker(marketId: string): Promise<Ticker> {
    return this.upbitClient.fetchTicker(marketId);
  }

  private async loadMarkets() {
    const marketDict = await this.upbitClient.loadMarkets();
    for (const marketId of Object.keys(marketDict)) {
      const market = this.upbitClient.markets[marketId];
      CryptoConverterService.registerMarket(market.base, market.quote);
    }
  }
}

@Injectable()
export class CryptoConverterService {
  private static relations: {[marketId: string]: Set<string>} = {};

  static lock() {
    // Not implemented
  }

  static unlock() {
    // Not implemented
  }

  static registerMarket(baseUnit: string, quoteUnit: string) {
    if (!this.relations[baseUnit]) {
      this.relations[baseUnit] = new Set();
    }
    if (!this.relations[quoteUnit]) {
      this.relations[quoteUnit] = new Set();
    }

    this.relations[baseUnit].add(quoteUnit);
    this.relations[quoteUnit].add(baseUnit);
  }

  static convertPrice(price: number, from: string, to: string) {
    console.log(this.findRoute(from, to));
  }

  private static findRoute(from: string, to: string): Array<string> {
    const queue = [from];
    const routes = {};
    routes[from] = [from];

    while (queue.length > 0) {
      const node = queue.shift();
      for (const next of this.relations[node]) {
        if (!routes[next]) {
          if (next === to) {
            return [...routes[node], next];
          }
          queue.push(next);
          routes[next] = [...routes[node], next];
        }
      }
    }

    return null;
  }
}
