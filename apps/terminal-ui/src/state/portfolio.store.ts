export interface Position {
  symbol: string;
  qty: number;
  avgPrice: number;
  pnl: number;
}

export class PortfolioStore {
  private positions = new Map<string, Position>();

  applySnapshot(positions: Position[]): void {
    this.positions = new Map(positions.map((position) => [position.symbol, position]));
  }

  getPosition(symbol: string): Position | undefined {
    return this.positions.get(symbol);
  }

  getPositionCount(): number {
    return this.positions.size;
  }
}
