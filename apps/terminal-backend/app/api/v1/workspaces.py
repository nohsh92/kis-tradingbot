from fastapi import APIRouter

from app.schemas.http import StubResponse, Workspace

router = APIRouter()


@router.get("", response_model=list[Workspace])
async def list_workspaces() -> list[Workspace]:
    return []


@router.get("/{workspace_id}", response_model=StubResponse)
async def get_workspace(workspace_id: str) -> StubResponse:
    return StubResponse(detail=f"GET workspace {workspace_id}")


@router.post("", response_model=StubResponse)
async def create_workspace() -> StubResponse:
    return StubResponse(detail="POST workspace")


@router.put("/{workspace_id}", response_model=StubResponse)
async def update_workspace(workspace_id: str) -> StubResponse:
    return StubResponse(detail=f"PUT workspace {workspace_id}")


@router.delete("/{workspace_id}", response_model=StubResponse)
async def delete_workspace(workspace_id: str) -> StubResponse:
    return StubResponse(detail=f"DELETE workspace {workspace_id}")
