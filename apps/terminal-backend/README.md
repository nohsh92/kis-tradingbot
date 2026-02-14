# terminal-backend

FastAPI-based backend scaffold for the KIS trading terminal.

## Current scaffold

- FastAPI application with centralized settings and logging bootstrap
- Versioned API router under `/api/v1`
- API-key gate for protected auth/KIS control endpoints (`X-API-Key`)
- KIS credential-aware auth module:
  - Access token manager (`/oauth2/tokenP`) with expiry cache + singleflight lock
  - WebSocket approval key manager (`/oauth2/Approval`) with expiry cache + singleflight lock
- Health endpoints:
  - `GET /api/v1/health`
  - `GET /api/v1/health/live`
  - `GET /api/v1/health/ready`
- Auth/KIS endpoints (API-key protected):
  - `GET /api/v1/auth/kis/status`
  - `POST /api/v1/auth/kis/token/refresh`
  - `POST /api/v1/auth/kis/approval/refresh`
- HTTP route stubs for:
  - workspaces
  - watchlists
  - symbols
  - history bars
  - orders (place/cancel/replace/list)
  - positions
- WebSocket gateway stub at `/api/v1/ws` returning:
  - `hello` handshake payload
  - initial empty `snapshot`

## KIS compatibility note

This scaffold targets the KIS OpenAPI pattern described in the project plan:
- REST OAuth token endpoint: `/oauth2/tokenP`
- REST WebSocket approval endpoint: `/oauth2/Approval`
- Separate PAPER vs LIVE base URLs and WS URLs

### Online documentation check status

I attempted to verify the latest online KIS docs from this environment, but outbound access is blocked (`403` through configured proxy, and direct egress unreachable). You should re-run the checks in your production/VPN environment before release:

```bash
cd apps/terminal-backend
python scripts/check_kis_docs.py
```

## Authentication and secrets management

1. Copy env template and populate secrets:

```bash
cd apps/terminal-backend
cp .env.example .env
```

2. Set strong server key for northbound API protection:
- `BACKEND_API_KEY`

3. Set broker credentials (never expose to frontend):
- `KIS_APP_KEY`
- `KIS_APP_SECRET`
- `KIS_ENV=paper|live`

4. Keep `REQUIRE_API_KEY=true` outside local experimentation.

5. For production, inject secrets from secret manager (Vault/KMS/SSM), not from committed files.

## Development Setup (Local Only)

**Note**: Virtual environments are for development only. Production uses Docker containers.

### Prerequisites
- Python 3.10-3.13
- pip

### 1. Create and activate virtual environment

```bash
cd apps/terminal-backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install --upgrade pip
pip install -e ".[dev]"
```

### 3. Development workflow commands

```bash
# Run linting (fix auto-fixable issues)
ruff check . --fix

# Run linting (check only, no fixes)
ruff check .

# Run tests
pytest

# Run server in development mode
uvicorn app.main:app --reload
```

### 4. Environment setup (required for KIS integration)

```bash
# Copy environment template
cp .env.example .env

# Edit .env and populate with your KIS credentials:
# - BACKEND_API_KEY (strong random key for API protection)
# - KIS_APP_KEY (from KIS OpenAPI)
# - KIS_APP_SECRET (from KIS OpenAPI)  
# - KIS_ENV=paper (or 'live' for production)
```

## Local development run

```bash
cd apps/terminal-backend
source .venv/bin/activate  # Development only
uvicorn app.main:app --reload
```

## API access examples

### 1) Health (public)

```bash
curl http://localhost:8000/api/v1/health
```

### 2) KIS status (protected)

```bash
curl -H "X-API-Key: ${BACKEND_API_KEY}" \
  http://localhost:8000/api/v1/auth/kis/status
```

### 3) Force refresh KIS access token (protected)

```bash
curl -X POST -H "X-API-Key: ${BACKEND_API_KEY}" \
  http://localhost:8000/api/v1/auth/kis/token/refresh
```

## Environment diagnostics (deploy readiness)

Run deploy preflight checks (Python range, package index connectivity, production dependency resolution):

```bash
cd apps/terminal-backend
CHECK_MODE=deploy ./scripts/check_env.sh
```

If this script exits non-zero, the environment is not deploy-ready. For local developer onboarding checks, run `CHECK_MODE=dev ./scripts/check_env.sh`.

## Container run (recommended for production consistency)

```bash
cd apps/terminal-backend/docker
docker compose up --build
```

This uses `python:3.12-slim` to avoid local interpreter drift.

## Test

```bash
cd apps/terminal-backend
pytest
```

## Next implementation milestones

1. Persist workspaces/watchlists in Postgres with migrations
2. Add JWT/session auth for UI users (separate from service API key)
3. Implement snapshot + incremental WS stream model
4. Integrate KIS REST/WS TR-specific wrappers and parsers
5. Flesh out OMS/portfolio domain services
