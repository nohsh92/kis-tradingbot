from fastapi import APIRouter

from app.api.v1 import (
    auth,
    health,
    history,
    orders,
    positions,
    symbols,
    watchlists,
    workspaces,
    ws_gateway,
)
from app.core.config import get_settings

settings = get_settings()

api_router = APIRouter(prefix=settings.api_v1_prefix)
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(workspaces.router, prefix="/workspaces", tags=["workspaces"])
api_router.include_router(watchlists.router, prefix="/watchlists", tags=["watchlists"])
api_router.include_router(symbols.router, prefix="/symbols", tags=["symbols"])
api_router.include_router(history.router, prefix="/history", tags=["history"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(positions.router, prefix="/positions", tags=["positions"])

api_router.include_router(ws_gateway.router, tags=["ws"])
