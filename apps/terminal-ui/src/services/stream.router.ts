import type { L1Quote, MarketDataStore } from '../state/marketdata.store';
import type { OrderEvent, OrdersStore } from '../state/orders.store';
import type { PortfolioStore, Position } from '../state/portfolio.store';

export type ServerMessage =
  | { type: 'marketdata.l1.batch'; data: L1Quote[] }
  | { type: 'orders.event'; data: OrderEvent }
  | { type: 'portfolio.snapshot'; data: Position[] }
  | { type: string; data?: unknown };

export class StreamRouter {
  constructor(
    private readonly marketDataStore: MarketDataStore,
    private readonly ordersStore: OrdersStore,
    private readonly portfolioStore: PortfolioStore
  ) {}

  route(message: ServerMessage): void {
    switch (message.type) {
      case 'marketdata.l1.batch':
        this.marketDataStore.applyL1Batch(message.data);
        return;
      case 'orders.event':
        this.ordersStore.applyOrderEvent(message.data);
        return;
      case 'portfolio.snapshot':
        this.portfolioStore.applySnapshot(message.data);
        return;
      default:
        return;
    }
  }
}
