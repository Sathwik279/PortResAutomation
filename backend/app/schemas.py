from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class VersionCreate(BaseModel):
    snapshot: dict[str, Any]
    message: str | None = None


class ConfigCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    snapshot: dict[str, Any]
    message: str | None = "Initial config"


class ConfigUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None


class ConfigVersionOut(BaseModel):
    id: int
    config_id: int
    version_number: int
    message: str | None
    snapshot_json: dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}


class ConfigOut(BaseModel):
    id: int
    name: str
    description: str | None
    current_version_id: int | None
    created_at: datetime
    updated_at: datetime
    current_version: ConfigVersionOut | None = None

    model_config = {"from_attributes": True}


class ConfigListItem(BaseModel):
    id: int
    name: str
    description: str | None
    current_version_id: int | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PublishRequest(BaseModel):
    project_id: str
    site_id: str | None = None
    token: str
    html: str
