from datetime import datetime

from pydantic import BaseModel


class KISConnectionStatus(BaseModel):
    environment: str
    restBaseUrl: str
    wsUrl: str
    hasAppKey: bool
    hasAppSecret: bool
    tokenExpiresAt: datetime | None = None
    approvalExpiresAt: datetime | None = None


class RefreshResult(BaseModel):
    detail: str
    expiresAt: datetime
