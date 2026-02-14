import type { ServerMessage } from './stream.router';

export type WsLifecycleHandler = (message: ServerMessage) => void;

export interface WsClientOptions {
  url: string;
  token?: string;
  onMessage: WsLifecycleHandler;
  reconnectBaseDelayMs?: number;
  createSocket?: (url: string) => WebSocket;
}

export class TerminalWsClient {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private lastMessageAt: number | null = null;
  private allowReconnect = true;

  private readonly createSocket: (url: string) => WebSocket;

  constructor(private readonly options: WsClientOptions) {
    this.createSocket = options.createSocket ?? ((url) => new WebSocket(url));
  }

  connect(): void {
    this.allowReconnect = true;

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const socket = this.createSocket(this.options.url);
    this.socket = socket;

    socket.addEventListener('open', () => {
      this.reconnectAttempts = 0;
      if (this.options.token) {
        this.send({ type: 'auth', token: this.options.token });
      }
    });

    socket.addEventListener('message', (event) => {
      this.lastMessageAt = Date.now();
      const parsed = JSON.parse(String(event.data)) as ServerMessage;
      this.options.onMessage(parsed);
    });

    socket.addEventListener('close', () => {
      this.socket = null;
      if (this.allowReconnect) {
        this.scheduleReconnect();
      }
    });
  }

  disconnect(): void {
    this.allowReconnect = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.socket?.close();
    this.socket = null;
  }

  subscribe(stream: string, symbols: string[]): void {
    this.send({ type: 'subscribe', stream, symbols });
  }

  unsubscribe(stream: string, symbols: string[]): void {
    this.send({ type: 'unsubscribe', stream, symbols });
  }

  getLastMessageAgeMs(now = Date.now()): number | null {
    if (!this.lastMessageAt) {
      return null;
    }

    return now - this.lastMessageAt;
  }

  private send(payload: Record<string, unknown>): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.socket.send(JSON.stringify(payload));
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return;
    }

    this.reconnectAttempts += 1;
    const base = this.options.reconnectBaseDelayMs ?? 500;
    const delay = Math.min(base * 2 ** (this.reconnectAttempts - 1), 5_000);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }
}
