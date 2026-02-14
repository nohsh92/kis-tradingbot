from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from app.connectors.kis.rest_client import KISRestClient


@dataclass(slots=True)
class ApprovalState:
    approval_key: str
    expires_at: datetime


class KISApprovalManager:
    def __init__(self, rest_client: KISRestClient) -> None:
        self.rest_client = rest_client
        self._state: ApprovalState | None = None
        self._lock = asyncio.Lock()

    async def get_approval_key(self) -> ApprovalState:
        if self._state and self._state.expires_at > datetime.now(UTC) + timedelta(minutes=1):
            return self._state

        async with self._lock:
            if self._state and self._state.expires_at > datetime.now(UTC) + timedelta(minutes=1):
                return self._state
            payload = await self.rest_client.fetch_approval_key()
            approval_key = payload["approval_key"]
            self._state = ApprovalState(
                approval_key=approval_key,
                expires_at=datetime.now(UTC) + timedelta(hours=24),
            )
            return self._state

    def peek_state(self) -> ApprovalState | None:
        return self._state

    async def force_refresh(self) -> ApprovalState:
        async with self._lock:
            payload = await self.rest_client.fetch_approval_key()
            approval_key = payload["approval_key"]
            self._state = ApprovalState(
                approval_key=approval_key,
                expires_at=datetime.now(UTC) + timedelta(hours=24),
            )
            return self._state
