from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field


class HelloMessage(BaseModel):
    type: str = "hello"
    protocolVersion: int = 1
    schemaVersion: int = 1
    serverTime: datetime = Field(default_factory=lambda: datetime.now(UTC))
    capabilities: dict[str, list[str]] = Field(
        default_factory=lambda: {
            "streams": ["l1", "l2", "trades", "orders", "portfolio", "alerts"],
            "venues": ["KRX", "NXT", "TOTAL"],
        }
    )


class SnapshotMessage(BaseModel):
    type: str = "snapshot"
    openOrders: list[dict[str, Any]] = Field(default_factory=list)
    positions: list[dict[str, Any]] = Field(default_factory=list)
