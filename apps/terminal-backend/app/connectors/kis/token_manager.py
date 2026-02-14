from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from app.connectors.kis.rest_client import KISRestClient


@dataclass(slots=True)
class TokenState:
    access_token: str
    expires_at: datetime


class KISTokenManager:
    def __init__(self, rest_client: KISRestClient) -> None:
        self.rest_client = rest_client
        self._state: TokenState | None = None
        self._lock = asyncio.Lock()

    async def get_token(self) -> TokenState:
        if self._state and self._state.expires_at > datetime.now(UTC) + timedelta(seconds=30):
            return self._state

        async with self._lock:
            if self._state and self._state.expires_at > datetime.now(UTC) + timedelta(seconds=30):
                return self._state
            payload = await self.rest_client.fetch_access_token()
            token = payload["access_token"]
            expires_in = int(payload.get("expires_in", 0))
            self._state = TokenState(
                access_token=token,
                expires_at=datetime.now(UTC) + timedelta(seconds=expires_in),
            )
            return self._state

    def peek_state(self) -> TokenState | None:
        return self._state

    async def force_refresh(self) -> TokenState:
        async with self._lock:
            payload = await self.rest_client.fetch_access_token()
            token = payload["access_token"]
            expires_in = int(payload.get("expires_in", 0))
            self._state = TokenState(
                access_token=token,
                expires_at=datetime.now(UTC) + timedelta(seconds=expires_in),
            )
            return self._state
