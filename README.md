# KIS Trading Terminal Monorepo

A single monorepo for building a Korean equity trading terminal with:

- **Desktop UI** (Electron + React + TypeScript)
- **Backend services** (FastAPI + WebSocket + KIS connector + OMS)
- **OpenAPI-first API contracts** for broad interoperability

This repository is intentionally organized to support parallel branch-based development by track (UI, Backend, API).

---

## 1) Monorepo layout

```text
kis-tradingbot/
  README.md
  docs/
    architecture/
    api/
    ui/
    backend/
    adr/
  apps/
    terminal-ui/
    terminal-backend/
  packages/
    api-contract/
      openapi/
    shared-types/
  infra/
    env/
    docker/
    ci/
  scripts/
  .github/workflows/
```

### Why this layout

- Keeps contract, implementation, and operations concerns separated but close.
- Enables independent velocity for each track while preserving integration points.
- Makes it easy to branch by component, then merge through contract-governed milestones.

---

## 2) Work tracks and ownership boundaries

### Track A — UI Frontend (`apps/terminal-ui`)
**Goal:** terminal-grade UX with keyboard-first workflows and high-frequency rendering.

**Key deliverables**
- Terminal shell + docking workspace
- Command bar parser + routing
- Watchlist/quote/chart/order/blotter/positions panels
- WS client + reconnect + health signals
- Performance hardening (batching, virtualization, backpressure)

### Track B — Backend Services (`apps/terminal-backend`)
**Goal:** reliable market data normalization, order correctness, persistence, and operations.

**Key deliverables**
- FastAPI HTTP + WS gateway
- KIS connector (REST token lifecycle + WS approval/decrypt/parse)
- Market data engine (cache + fanout + coalescing)
- OMS + reconciliation + portfolio streaming
- Postgres persistence, audit, observability, kill switch

### Track C — API Contract (`packages/api-contract/openapi`)
**Goal:** stable, versioned protocol independent from broker implementation details.

**Key deliverables**
- OpenAPI JSON as source-of-truth for HTTP
- WS protocol documentation and message schemas
- Versioning and compatibility policy
- Error model and rate-limit controls

---

## 3) OpenAPI-first contract strategy

We are using **OpenAPI JSON first** to maximize portability across clients, backends, and tooling.

### Contract flow
1. Define/update OpenAPI in `packages/api-contract/openapi/v1.openapi.json`
2. Validate contract in CI
3. Generate downstream artifacts as needed (server stubs, client SDKs, JSON schemas)
4. Track breaking/non-breaking changes via ADR + semver policy

### Non-goal
- UI and backend should not evolve transport payloads ad hoc outside contract review.

---

## 4) Detailed implementation plan

## Phase 0 — Foundation (current focus)

- [x] Establish monorepo folder structure
- [x] Add implementation roadmap in root README
- [x] Add OpenAPI v1 starter contract skeleton
- [x] Add CI templates for lint/test/contract validation
- [ ] Add local bootstrap scripts and base configs

## Phase 1 — Contract + Core persistence

1. Finalize API v1 baseline:
   - Workspaces, watchlists, symbols, history, orders, positions endpoints
   - Standard error envelope
2. Implement backend persistence:
   - Postgres schema + migration workflow
   - workspace/watchlist CRUD repositories
3. Implement WS handshake baseline:
   - `hello` + auth + snapshot + subscribe/unsubscribe semantics

**Exit criteria**
- UI dev can connect to mock/backend and receive snapshots + synthetic L1 stream.

## Phase 2 — Streaming market data + UI shell

1. Backend:
   - KIS token manager + approval manager
   - WS ingest loop + parser + mapping + cache
2. UI:
   - Electron shell + docking + command bar
   - Watchlist panel with virtualized updates
3. Contract:
   - confirm `marketdata.l1.batch`, `marketdata.l2.delta`, `marketdata.trades`

**Exit criteria**
- Watchlist and quote panels are live and reconnect-safe.

## Phase 3 — OMS + blotter + positions

1. Backend OMS state machine with idempotent placement and event persistence
2. Fill ingestion + reconciliation job
3. Portfolio snapshots and incremental updates
4. UI order ticket/blotter/positions panel completion

**Exit criteria**
- Paper order lifecycle observable end-to-end with accurate position updates.

## Phase 4 — Hardening + ops

1. Metrics/logging/tracing + kill switch controls
2. Backpressure tuning and stress tests
3. Packaging/release channels

**Exit criteria**
- Stable in sustained session with target symbol/panel load.

---

## 5) Branching model for parallel development

### Long-lived branches
- `main` — protected, stable
- `develop` (optional) — integration staging

### Track branches (examples)
- `feature/track-a-ui-shell`
- `feature/track-a-market-panels`
- `feature/track-b-gateway-persistence`
- `feature/track-b-kis-connector`
- `feature/track-b-oms-portfolio`
- `feature/track-c-openapi-v1`

### Rules
- Contract changes merge first (or together with gated implementation)
- Feature branches should include tests and updated docs
- Prefer small PRs tied to integration milestones

---

## 6) CI templates included now

Current workflow templates in `.github/workflows`:
- `ci-lint.yml` — basic lint/format placeholders
- `ci-test.yml` — backend and frontend test placeholders
- `ci-contract.yml` — OpenAPI JSON validation check

These are starter pipelines and will be expanded as tooling is finalized.

---

## 7) Immediate next steps

1. Flesh out `apps/terminal-backend` scaffold (FastAPI app + health + v1 route stubs)
2. Flesh out `apps/terminal-ui` scaffold (Electron+React entry shell)
3. Expand OpenAPI v1 with full schemas for all payloads listed in project map
4. Add developer bootstrap commands and local compose stack

---

## 8) Development principles

- UI never connects directly to KIS.
- Backend is source-of-truth for session state, trading permissions, and positions.
- Streaming is always snapshot then incremental.
- Do not ship contract drift: every change should be reflected in OpenAPI/docs.
- Prefer reliability and debuggability over early microservice fragmentation.
- Before merging branch to master, ensure that tests exist in CI to check for any errors. If the tests do not exist, add them.

