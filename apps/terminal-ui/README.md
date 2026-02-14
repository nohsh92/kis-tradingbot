# terminal-ui

Desktop terminal frontend (Electron + React + TypeScript).

## Current implementation
- Electron shell (`electron/main.ts`, `electron/preload.ts`)
- React terminal shell (`AppShell`) with status bar, docking placeholder, and command bar
- Workspace persistence store with local-first hydration and backend reconciliation
- GO-style command parser and panel routing helpers
- WebSocket client and stream router scaffolding for normalized market/order/portfolio updates
- Vitest unit tests for shell rendering, command parser, WS client, and stream routing

## Development
```bash
npm ci
npm run dev
```

## Validation
```bash
npm run lint
npm test
```
