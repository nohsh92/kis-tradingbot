import type { CommandIntent } from '../components/CommandBar/parser';

export type PanelType = 'watchlist' | 'quote' | 'chart' | 'orderTicket' | 'blotter' | 'alerts' | 'scanner';

export interface PanelRoute {
  panel: PanelType;
  symbol?: string;
}

const FUNCTION_ROUTE_MAP: Record<string, PanelType> = {
  CHART: 'chart',
  QUOTE: 'quote',
  ORD: 'orderTicket',
  ORDER: 'orderTicket',
  BLT: 'blotter',
  ALERTS: 'alerts',
  SCAN: 'scanner'
};

export function resolvePanelRoute(intent: CommandIntent): PanelRoute {
  if (intent.kind === 'symbol') {
    return { panel: 'quote', symbol: intent.symbol };
  }

  if (intent.kind === 'symbolFunction') {
    return {
      panel: FUNCTION_ROUTE_MAP[intent.functionCode] ?? 'quote',
      symbol: intent.symbol
    };
  }

  return { panel: FUNCTION_ROUTE_MAP[intent.functionCode] ?? 'watchlist' };
}
