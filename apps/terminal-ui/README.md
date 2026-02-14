# terminal-ui

Electron + React scaffold for the trading terminal desktop shell.

## Prerequisites

- Node.js 20+
- npm 10+

## Run locally

```bash
cd apps/terminal-ui
npm install
npm run dev
```

This starts:

- Vite dev server for the renderer (`http://localhost:5173`)
- Electron main process pointed at the Vite URL

## Scripts

- `npm run dev` - runs renderer and Electron together for local development
- `npm run dev:electron` - builds Electron process files and starts Electron
- `npm run build` - builds renderer and Electron outputs
- `npm run lint` - runs ESLint over TypeScript sources
- `npm run test` - runs Vitest suite
- `npm run dist` - produces an Electron package with electron-builder

## Scaffold layout

- `electron/main.ts` - Electron main process bootstrap and BrowserWindow setup
- `electron/preload.ts` - isolated preload bridge exposed to renderer
- `src/app/AppShell.tsx` - root terminal shell layout
- `src/components/StatusBar` - top status bar placeholders
- `src/components/CommandBar` - global command bar mount placeholder
- `src/components/Docking` - docking root placeholder container


## IPC bridge

The preload script exposes a narrow `desktop` bridge with `getRuntimeInfo()` that invokes a single main-process IPC handler (`app:get-runtime-info`).
