from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "terminal-backend"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class StubResponse(BaseModel):
    message: str = "Not implemented"
    detail: str


class Workspace(BaseModel):
    id: str
    name: str
    schemaVersion: int = 1
    layout: dict[str, Any] = Field(default_factory=dict)
    openPanels: list[dict[str, Any]] = Field(default_factory=list)


class Watchlist(BaseModel):
    id: str
    name: str
    symbols: list[str] = Field(default_factory=list)


class SymbolInfo(BaseModel):
    symbol: str
    name: str
    market: str
    halted: bool = False
