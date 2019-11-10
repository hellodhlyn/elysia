import { Injectable } from '@nestjs/common';
import { upbit } from 'ccxt';
import Decimal from 'decimal.js';

import { ExchangeService } from './exchanges.service';

export interface ConvertPriceResult {
  readonly convertedPrice: string;
  readonly route: string[];
}

@Injectable()
export class ConverterService {
  private exchange = ExchangeService.of(new upbit());
  private relations: { [marketId: string]: Set<string> } = {};

  async convertPrice(price: Decimal, from: string, to: string): Promise<ConvertPriceResult> {
    await this.syncMarkets();

    const route = this.findRoute(from, to);
    if (!route) {
      return { convertedPrice: null, route };
    }

    let convertedPrice = price;
    const markets = await this.exchange.markets();
    for (let i = 0; i < route.length - 1; i += 1) {
      const marketId = `${route[i + 1]}-${route[i]}`;
      const reversedId = `${route[i]}-${route[i + 1]}`;

      const market = markets.filter((m) => [marketId, reversedId].includes(m.id));
      const ticker = await this.exchange.ticker(market[0].symbol);
      const lastPrice = new Decimal(ticker.last);
      convertedPrice = (market[0].id === marketId) ? convertedPrice.times(lastPrice) : convertedPrice.dividedBy(lastPrice);
    }

    return { convertedPrice: convertedPrice.toFixed(8), route };
  }

  private async syncMarkets() {
    const markets = await this.exchange.markets();
    markets.forEach(market => {
      const baseUnit = market.baseId;
      const quoteUnit = market.quoteId;

      if (!this.relations[baseUnit]) {
        this.relations[baseUnit] = new Set();
      }
      if (!this.relations[quoteUnit]) {
        this.relations[quoteUnit] = new Set();
      }

      this.relations[baseUnit].add(quoteUnit);
      this.relations[quoteUnit].add(baseUnit);
    });
  }

  private findRoute(from: string, to: string): string[] {
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
