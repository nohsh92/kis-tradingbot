import { describe, expect, it } from 'vitest';
import { parseCommand } from '../components/CommandBar/parser';
import { resolvePanelRoute } from '../app/routes';

describe('command parser', () => {
  it('parses symbol-only command', () => {
    const intent = parseCommand('005930');
    expect(intent).toEqual({ kind: 'symbol', symbol: '005930' });
    expect(resolvePanelRoute(intent!)).toEqual({ panel: 'quote', symbol: '005930' });
  });

  it('parses symbol + function command alias', () => {
    const intent = parseCommand('005930 ORD');
    expect(intent).toEqual({ kind: 'symbolFunction', symbol: '005930', functionCode: 'ORD' });
    expect(resolvePanelRoute(intent!)).toEqual({ panel: 'orderTicket', symbol: '005930' });
  });

  it('parses function-only command', () => {
    const intent = parseCommand('blotter');
    expect(intent).toEqual({ kind: 'functionOnly', functionCode: 'BLT' });
    expect(resolvePanelRoute(intent!)).toEqual({ panel: 'blotter' });
  });

  it('returns null for invalid text', () => {
    expect(parseCommand('삼성전자 QUOTE')).toBeNull();
    expect(parseCommand('BAD INPUT')).toBeNull();
    expect(parseCommand('005930 QUOTE EXTRA')).toBeNull();
  });
});
