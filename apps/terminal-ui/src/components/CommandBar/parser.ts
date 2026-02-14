export type CommandIntent =
  | { kind: 'symbol'; symbol: string }
  | { kind: 'symbolFunction'; symbol: string; functionCode: string }
  | { kind: 'functionOnly'; functionCode: string };

const FUNCTION_ALIASES: Record<string, string> = {
  BLT: 'BLT',
  BLOTTER: 'BLT',
  ALERTS: 'ALERTS',
  ALRT: 'ALERTS',
  QUOTE: 'QUOTE',
  QTE: 'QUOTE',
  CHART: 'CHART',
  CHRT: 'CHART',
  ORD: 'ORD',
  ORDER: 'ORD',
  SCAN: 'SCAN'
};

const SYMBOL_PATTERN = /^\d{6}$/;

export function parseCommand(input: string): CommandIntent | null {
  const normalized = input.trim().replace(/\s+/g, ' ');
  if (!normalized) {
    return null;
  }

  const parts = normalized.split(' ');

  if (parts.length === 1) {
    if (SYMBOL_PATTERN.test(parts[0])) {
      return { kind: 'symbol', symbol: parts[0] };
    }

    const functionCode = toFunctionCode(parts[0]);
    return functionCode ? { kind: 'functionOnly', functionCode } : null;
  }

  if (parts.length !== 2) {
    return null;
  }

  const [maybeSymbol, maybeFunction] = parts;
  if (SYMBOL_PATTERN.test(maybeSymbol)) {
    const functionCode = toFunctionCode(maybeFunction);
    if (!functionCode) {
      return null;
    }

    return {
      kind: 'symbolFunction',
      symbol: maybeSymbol,
      functionCode
    };
  }

  return null;
}

function toFunctionCode(token: string): string | null {
  const key = token.toUpperCase();
  return FUNCTION_ALIASES[key] ?? null;
}
