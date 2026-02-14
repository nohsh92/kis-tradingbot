from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_workspace_list_route_exists() -> None:
    response = client.get('/api/v1/workspaces')

    assert response.status_code == 200
    assert response.json() == []


def test_watchlist_list_route_exists() -> None:
    response = client.get('/api/v1/watchlists')

    assert response.status_code == 200
    assert response.json() == []
