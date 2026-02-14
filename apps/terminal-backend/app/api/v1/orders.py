from fastapi import APIRouter

from app.schemas.http import StubResponse

router = APIRouter()


@router.post("", response_model=StubResponse)
async def place_order() -> StubResponse:
    return StubResponse(detail="POST order")


@router.post("/{order_id}/cancel", response_model=StubResponse)
async def cancel_order(order_id: str) -> StubResponse:
    return StubResponse(detail=f"POST order {order_id} cancel")


@router.post("/{order_id}/replace", response_model=StubResponse)
async def replace_order(order_id: str) -> StubResponse:
    return StubResponse(detail=f"POST order {order_id} replace")


@router.get("", response_model=StubResponse)
async def list_orders() -> StubResponse:
    return StubResponse(detail="GET orders")
