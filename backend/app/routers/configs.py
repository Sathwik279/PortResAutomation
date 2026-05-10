from fastapi import APIRouter, Depends, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..db import get_db
from ..models import Config, ConfigVersion
from ..schemas import ConfigCreate, ConfigListItem, ConfigOut, ConfigUpdate, ConfigVersionOut, VersionCreate, PublishRequest
from ..services.config_service import create_version, get_config_or_404
from ..services.firebase_deploy import deploy_to_firebase

router = APIRouter(prefix="/api/configs", tags=["configs"])


def attach_current_version(db: Session, config: Config) -> ConfigOut:
    version = None
    if config.current_version_id:
        version = db.get(ConfigVersion, config.current_version_id)
    return ConfigOut.model_validate(config).model_copy(update={"current_version": version})


@router.get("", response_model=list[ConfigListItem])
def list_configs(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return db.scalars(
        select(Config)
        .where(Config.is_deleted.is_(False), Config.user_id == user["uid"])
        .order_by(Config.updated_at.desc(), Config.id.desc())
    ).all()


@router.post("", response_model=ConfigOut, status_code=201)
def create_config(payload: ConfigCreate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    config = Config(name=payload.name, description=payload.description, user_id=user["uid"])
    db.add(config)
    db.commit()
    db.refresh(config)
    create_version(db, config, payload.snapshot, payload.message)
    return attach_current_version(db, config)


@router.get("/{config_id}", response_model=ConfigOut)
def get_config(config_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    return attach_current_version(db, get_config_or_404(db, config_id, user["uid"]))


@router.patch("/{config_id}", response_model=ConfigOut)
def update_config(config_id: int, payload: ConfigUpdate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    config = get_config_or_404(db, config_id, user["uid"])
    if payload.name is not None:
        config.name = payload.name
    if payload.description is not None:
        config.description = payload.description
    db.add(config)
    db.commit()
    db.refresh(config)
    return attach_current_version(db, config)


@router.delete("/{config_id}", status_code=204)
def delete_config(config_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    config = get_config_or_404(db, config_id, user["uid"])
    config.is_deleted = True
    db.add(config)
    db.commit()
    return Response(status_code=204)


@router.get("/{config_id}/versions", response_model=list[ConfigVersionOut])
def list_versions(config_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    get_config_or_404(db, config_id, user["uid"])
    return db.scalars(
        select(ConfigVersion)
        .where(ConfigVersion.config_id == config_id)
        .order_by(ConfigVersion.version_number.desc())
    ).all()


@router.post("/{config_id}/versions", response_model=ConfigVersionOut, status_code=201)
def save_version(config_id: int, payload: VersionCreate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    config = get_config_or_404(db, config_id, user["uid"])
    return create_version(db, config, payload.snapshot, payload.message)


@router.get("/{config_id}/versions/{version_id}", response_model=ConfigVersionOut)
def get_version(config_id: int, version_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    get_config_or_404(db, config_id, user["uid"])
    version = db.scalar(
        select(ConfigVersion).where(
            ConfigVersion.id == version_id,
            ConfigVersion.config_id == config_id,
        )
    )
    if not version:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Version not found")
    return version


@router.post("/{config_id}/versions/{version_id}/restore", response_model=ConfigVersionOut, status_code=201)
def restore_version(config_id: int, version_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    config = get_config_or_404(db, config_id, user["uid"])
    version = db.scalar(
        select(ConfigVersion).where(
            ConfigVersion.id == version_id,
            ConfigVersion.config_id == config_id,
        )
    )
    if not version:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Version not found")
    return create_version(
        db,
        config,
        version.snapshot_json,
        f"Restored from version {version.version_number}",
    )


@router.post("/{config_id}/publish")
async def publish_config(config_id: int, payload: PublishRequest, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    get_config_or_404(db, config_id, user["uid"])
    try:
        result = await deploy_to_firebase(
            project_id=payload.project_id,
            site_id=payload.site_id,
            token=payload.token,
            html_content=payload.html
        )
        return {"status": "success", "result": result}
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=str(e))
