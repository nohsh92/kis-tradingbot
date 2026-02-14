from functools import lru_cache

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "KIS Terminal Backend"
    app_env: str = Field(default="local", description="Deployment environment")
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    api_v1_prefix: str = "/api/v1"

    require_api_key: bool = True
    backend_api_key: SecretStr | None = None

    kis_env: str = Field(default="paper", description="KIS environment: paper or live")
    kis_live_rest_base_url: str = "https://openapi.koreainvestment.com:9443"
    kis_paper_rest_base_url: str = "https://openapivts.koreainvestment.com:29443"
    kis_live_ws_url: str = "ws://ops.koreainvestment.com:21000"
    kis_paper_ws_url: str = "ws://ops.koreainvestment.com:31000"
    kis_app_key: SecretStr | None = None
    kis_app_secret: SecretStr | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def kis_rest_base_url(self) -> str:
        return (
            self.kis_live_rest_base_url
            if self.kis_env.lower() == "live"
            else self.kis_paper_rest_base_url
        )

    @property
    def kis_ws_url(self) -> str:
        return self.kis_live_ws_url if self.kis_env.lower() == "live" else self.kis_paper_ws_url


@lru_cache
def get_settings() -> Settings:
    return Settings()
