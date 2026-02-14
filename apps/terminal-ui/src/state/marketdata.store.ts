export interface L1Quote {
  symbol: string;
  lastPrice: number;
  change: number;
  volume: number;
  updatedAt: string;
}

export class MarketDataStore {
  private quotes = new Map<string, L1Quote>();

  applyL1Batch(rows: L1Quote[]): void {
    for (const row of rows) {
      this.quotes.set(row.symbol, row);
    }
  }

  getQuote(symbol: string): L1Quote | undefined {
    return this.quotes.get(symbol);
  }

  getQuoteCount(): number {
    return this.quotes.size;
  }
}
