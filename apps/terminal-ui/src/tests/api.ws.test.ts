import { afterEach, describe, expect, it, vi } from 'vitest';
import { TerminalWsClient } from '../services/api.ws';

class FakeWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readyState = FakeWebSocket.CONNECTING;
  sent: string[] = [];
  private listeners = new Map<string, Array<(event?: { data?: string }) => void>>();

  addEventListener(type: string, listener: (event?: { data?: string }) => void): void {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  send(message: string): void {
    this.sent.push(message);
  }

  close(): void {
    this.readyState = FakeWebSocket.CLOSED;
    this.emit('close');
  }

  emit(type: string, data?: string): void {
    if (type === 'open') {
      this.readyState = FakeWebSocket.OPEN;
    }

    for (const listener of this.listeners.get(type) ?? []) {
      listener(data ? { data } : undefined);
    }
  }
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('TerminalWsClient', () => {
  it('authenticates on open and forwards messages', () => {
    const socket = new FakeWebSocket();
    const onMessage = vi.fn();

    const client = new TerminalWsClient({
      url: 'ws://localhost:8000/api/v1/ws',
      token: 'token',
      onMessage,
      createSocket: () => socket as unknown as WebSocket
    });

    client.connect();
    socket.emit('open');

    expect(socket.sent[0]).toContain('"type":"auth"');

    socket.emit('message', JSON.stringify({ type: 'portfolio.snapshot', data: [] }));
    expect(onMessage).toHaveBeenCalledWith({ type: 'portfolio.snapshot', data: [] });

    client.subscribe('l1', ['005930']);
    expect(socket.sent[1]).toContain('"type":"subscribe"');
  });

  it('does not schedule reconnect after manual disconnect', () => {
    const socket = new FakeWebSocket();
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    const client = new TerminalWsClient({
      url: 'ws://localhost:8000/api/v1/ws',
      onMessage: () => undefined,
      createSocket: () => socket as unknown as WebSocket
    });

    client.connect();
    socket.emit('open');

    client.disconnect();

    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });
});
