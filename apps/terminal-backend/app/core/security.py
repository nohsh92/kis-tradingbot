import secrets

from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader

from app.core.config import Settings, get_settings

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def verify_api_key(
    provided_api_key: str | None = Depends(api_key_header),
    settings: Settings = Depends(get_settings),
) -> None:
    if not settings.require_api_key:
        return

    configured = settings.backend_api_key.get_secret_value() if settings.backend_api_key else None
    if not configured:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Backend API key authentication is enabled but no key is configured.",
        )

    if not provided_api_key or not secrets.compare_digest(provided_api_key, configured):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
        )
