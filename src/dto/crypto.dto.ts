import { Market } from 'ccxt';

export class CurrencyResponse {
  readonly id: string;
  readonly koreanName: string;
  readonly englishName: string;
  readonly baseUnit: string;
  readonly quoteUnit: string;
  readonly active: boolean;

  constructor(id: string, koreanName: string, englishName: string, baseUnit: string, quoteUnit: string, active: boolean) {
    this.id = id;
    this.koreanName = koreanName;
    this.englishName = englishName;
    this.baseUnit = baseUnit;
    this.quoteUnit = quoteUnit;
    this.active = active;
  }

  static fromCcxtMarket(market: Market) {
    return new CurrencyResponse(
      market.id,
      market.info.korean_name,
      market.info.english_name,
      market.base,
      market.quote,
      market.active,
    );
  }
}
