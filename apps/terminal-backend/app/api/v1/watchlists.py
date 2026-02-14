from fastapi import APIRouter

from app.schemas.http import StubResponse, Watchlist

router = APIRouter()


@router.get("", response_model=list[Watchlist])
async def list_watchlists() -> list[Watchlist]:
    return []


@router.post("", response_model=StubResponse)
async def create_watchlist() -> StubResponse:
    return StubResponse(detail="POST watchlist")


@router.put("/{watchlist_id}", response_model=StubResponse)
async def update_watchlist(watchlist_id: str) -> StubResponse:
    return StubResponse(detail=f"PUT watchlist {watchlist_id}")


@router.delete("/{watchlist_id}", response_model=StubResponse)
async def delete_watchlist(watchlist_id: str) -> StubResponse:
    return StubResponse(detail=f"DELETE watchlist {watchlist_id}")


@router.post("/{watchlist_id}/items", response_model=StubResponse)
async def add_watchlist_items(watchlist_id: str) -> StubResponse:
    return StubResponse(detail=f"POST watchlist {watchlist_id} items")


@router.delete("/{watchlist_id}/items", response_model=StubResponse)
async def delete_watchlist_items(watchlist_id: str) -> StubResponse:
    return StubResponse(detail=f"DELETE watchlist {watchlist_id} items")
