from fastapi import APIRouter, WebSocket

from app.schemas.ws import HelloMessage, SnapshotMessage

router = APIRouter()


@router.websocket("/ws")
async def websocket_gateway(websocket: WebSocket) -> None:
    await websocket.accept()
    await websocket.send_json(HelloMessage().model_dump(mode="json"))
    await websocket.send_json(SnapshotMessage().model_dump(mode="json"))
    await websocket.close(code=1000)
