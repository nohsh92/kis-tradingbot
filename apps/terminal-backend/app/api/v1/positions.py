from fastapi import APIRouter

from app.schemas.http import StubResponse

router = APIRouter()


@router.get("", response_model=StubResponse)
async def list_positions() -> StubResponse:
    return StubResponse(detail="GET positions")
