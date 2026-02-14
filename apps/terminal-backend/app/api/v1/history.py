from fastapi import APIRouter

from app.schemas.http import StubResponse

router = APIRouter()


@router.get("/bars", response_model=StubResponse)
async def get_history_bars() -> StubResponse:
    return StubResponse(detail="GET history bars")
