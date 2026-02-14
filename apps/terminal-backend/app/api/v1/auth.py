from fastapi import APIRouter, Depends

from app.connectors.kis.approval_manager import KISApprovalManager
from app.connectors.kis.token_manager import KISTokenManager
from app.core.config import Settings, get_settings
from app.core.security import verify_api_key
from app.dependencies.kis import get_approval_manager, get_token_manager
from app.schemas.auth import KISConnectionStatus, RefreshResult

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.get("/kis/status", response_model=KISConnectionStatus)
async def kis_status(
    settings: Settings = Depends(get_settings),
    token_manager: KISTokenManager = Depends(get_token_manager),
    approval_manager: KISApprovalManager = Depends(get_approval_manager),
) -> KISConnectionStatus:
    token_state = token_manager.peek_state()
    approval_state = approval_manager.peek_state()

    return KISConnectionStatus(
        environment=settings.kis_env,
        restBaseUrl=settings.kis_rest_base_url,
        wsUrl=settings.kis_ws_url,
        hasAppKey=bool(settings.kis_app_key),
        hasAppSecret=bool(settings.kis_app_secret),
        tokenExpiresAt=token_state.expires_at if token_state else None,
        approvalExpiresAt=approval_state.expires_at if approval_state else None,
    )


@router.post("/kis/token/refresh", response_model=RefreshResult)
async def refresh_kis_token(
    token_manager: KISTokenManager = Depends(get_token_manager),
) -> RefreshResult:
    state = await token_manager.force_refresh()
    return RefreshResult(detail="KIS access token refreshed", expiresAt=state.expires_at)


@router.post("/kis/approval/refresh", response_model=RefreshResult)
async def refresh_kis_approval(
    approval_manager: KISApprovalManager = Depends(get_approval_manager),
) -> RefreshResult:
    state = await approval_manager.force_refresh()
    return RefreshResult(detail="KIS websocket approval key refreshed", expiresAt=state.expires_at)
