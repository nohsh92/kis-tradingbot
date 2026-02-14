from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI
from fastapi.responses import ORJSONResponse

from app.api.router import api_router
from app.connectors.kis.approval_manager import KISApprovalManager
from app.connectors.kis.rest_client import KISRestClient
from app.connectors.kis.token_manager import KISTokenManager
from app.core.config import Settings, get_settings
from app.core.logging import configure_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings: Settings = get_settings()
    configure_logging(settings=settings)

    http_client = httpx.AsyncClient()
    kis_rest_client = KISRestClient(settings=settings, http_client=http_client)
    app.state.settings = settings
    app.state.http_client = http_client
    app.state.kis_rest_client = kis_rest_client
    app.state.kis_token_manager = KISTokenManager(rest_client=kis_rest_client)
    app.state.kis_approval_manager = KISApprovalManager(rest_client=kis_rest_client)

    try:
        yield
    finally:
        await http_client.aclose()


app = FastAPI(
    title="KIS Terminal Backend",
    description="HTTP and WebSocket gateway scaffold for KIS trading terminal",
    version="0.1.0",
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
)

app.include_router(api_router)
