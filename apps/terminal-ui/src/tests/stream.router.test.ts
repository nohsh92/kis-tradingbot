import { describe, expect, it } from 'vitest';
import { StreamRouter } from '../services/stream.router';
import { MarketDataStore } from '../state/marketdata.store';
import { OrdersStore } from '../state/orders.store';
import { PortfolioStore } from '../state/portfolio.store';

describe('stream router', () => {
  it('routes L1, order, and portfolio events into stores', () => {
    const marketDataStore = new MarketDataStore();
    const ordersStore = new OrdersStore();
    const portfolioStore = new PortfolioStore();

    const router = new StreamRouter(marketDataStore, ordersStore, portfolioStore);

    router.route({
      type: 'marketdata.l1.batch',
      data: [{ symbol: '005930', lastPrice: 80000, change: 250, volume: 50000, updatedAt: '2026-01-01T00:00:00Z' }]
    });

    router.route({
      type: 'orders.event',
      data: { orderId: 'ord-1', status: 'ACK', symbol: '005930', qty: 10, updatedAt: '2026-01-01T00:00:01Z' }
    });

    router.route({
      type: 'portfolio.snapshot',
      data: [{ symbol: '005930', qty: 10, avgPrice: 79000, pnl: 10000 }]
    });

    expect(marketDataStore.getQuote('005930')?.lastPrice).toBe(80000);
    expect(ordersStore.getOrder('ord-1')?.status).toBe('ACK');
    expect(portfolioStore.getPosition('005930')?.qty).toBe(10);
  });
});
