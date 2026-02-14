export interface OrderEvent {
  orderId: string;
  status: 'ACK' | 'FILL' | 'REJECT' | 'CANCELLED';
  symbol: string;
  qty: number;
  filledQty?: number;
  updatedAt: string;
}

export class OrdersStore {
  private orders = new Map<string, OrderEvent>();

  applyOrderEvent(event: OrderEvent): void {
    this.orders.set(event.orderId, event);
  }

  getOrder(orderId: string): OrderEvent | undefined {
    return this.orders.get(orderId);
  }
}
