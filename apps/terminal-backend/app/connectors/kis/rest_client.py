from __future__ import annotations

from typing import Any

import httpx

from app.core.config import Settings


class KISRestClient:
    def __init__(self, settings: Settings, http_client: httpx.AsyncClient) -> None:
        self.settings = settings
        self.http_client = http_client

    async def fetch_access_token(self) -> dict[str, Any]:
        if not self.settings.kis_app_key or not self.settings.kis_app_secret:
            raise RuntimeError("KIS app key/secret must be configured.")

        payload = {
            "grant_type": "client_credentials",
            "appkey": self.settings.kis_app_key.get_secret_value(),
            "appsecret": self.settings.kis_app_secret.get_secret_value(),
        }
        response = await self.http_client.post(
            f"{self.settings.kis_rest_base_url}/oauth2/tokenP",
            json=payload,
            timeout=10.0,
        )
        response.raise_for_status()
        return response.json()

    async def fetch_approval_key(self) -> dict[str, Any]:
        if not self.settings.kis_app_key or not self.settings.kis_app_secret:
            raise RuntimeError("KIS app key/secret must be configured.")

        payload = {
            "grant_type": "client_credentials",
            "appkey": self.settings.kis_app_key.get_secret_value(),
            "secretkey": self.settings.kis_app_secret.get_secret_value(),
        }
        response = await self.http_client.post(
            f"{self.settings.kis_rest_base_url}/oauth2/Approval",
            json=payload,
            timeout=10.0,
        )
        response.raise_for_status()
        return response.json()
