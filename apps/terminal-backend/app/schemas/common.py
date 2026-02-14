from datetime import UTC, datetime

from pydantic import BaseModel, ConfigDict, Field


class APIMessage(BaseModel):
    model_config = ConfigDict(populate_by_name=True)


class Timestamped(APIMessage):
    ts: datetime = Field(default_factory=lambda: datetime.now(UTC))
