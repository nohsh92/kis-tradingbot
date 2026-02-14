from fastapi import HTTPException, Request, status

from app.connectors.kis.approval_manager import KISApprovalManager
from app.connectors.kis.token_manager import KISTokenManager


def get_token_manager(request: Request) -> KISTokenManager:
    manager = getattr(request.app.state, "kis_token_manager", None)
    if manager is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="KIS token manager unavailable")
    return manager


def get_approval_manager(request: Request) -> KISApprovalManager:
    manager = getattr(request.app.state, "kis_approval_manager", None)
    if manager is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="KIS approval manager unavailable",
        )
    return manager
