from fastapi import APIRouter, Query

from app.schemas.http import StubResponse, SymbolInfo

router = APIRouter()


@router.get("/search", response_model=list[SymbolInfo])
async def search_symbols(q: str = Query(..., min_length=1)) -> list[SymbolInfo]:
    return [
        SymbolInfo(symbol="005930", name="삼성전자", market="KOSPI", halted=False)
    ] if q else []


@router.get("/{symbol}", response_model=StubResponse)
async def get_symbol(symbol: str) -> StubResponse:
    return StubResponse(detail=f"GET symbol {symbol}")
