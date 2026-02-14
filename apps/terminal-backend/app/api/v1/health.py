from fastapi import APIRouter

from app.schemas.http import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def healthcheck() -> HealthResponse:
    return HealthResponse(status="ok")


@router.get("/health/live", response_model=HealthResponse)
async def liveness() -> HealthResponse:
    return HealthResponse(status="live")


@router.get("/health/ready", response_model=HealthResponse)
async def readiness() -> HealthResponse:
    return HealthResponse(status="ready")
