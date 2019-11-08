import { Market, Currency } from 'ccxt';

export class CurrencyResponse {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  static fromCcxtMarket(currency: Currency) {
    return new CurrencyResponse(currency.id);
  }
}
