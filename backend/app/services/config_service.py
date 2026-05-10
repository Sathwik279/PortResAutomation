from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..models import Config, ConfigVersion


def get_config_or_404(db: Session, config_id: int, user_id: str) -> Config:
    config = db.scalar(
        select(Config).where(
            Config.id == config_id, 
            Config.is_deleted.is_(False),
            Config.user_id == user_id
        )
    )
    if not config:
        raise HTTPException(status_code=404, detail="Config not found")
    return config


def create_version(
    db: Session,
    config: Config,
    snapshot: dict,
    message: str | None = None,
) -> ConfigVersion:
    latest_number = db.scalar(
        select(func.max(ConfigVersion.version_number)).where(ConfigVersion.config_id == config.id)
    )
    version = ConfigVersion(
        config_id=config.id,
        version_number=(latest_number or 0) + 1,
        message=message,
        snapshot_json=snapshot,
    )
    db.add(version)
    db.flush()
    config.current_version_id = version.id
    db.add(config)
    db.commit()
    db.refresh(version)
    db.refresh(config)
    return version
