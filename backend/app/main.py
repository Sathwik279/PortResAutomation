import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine
from .routers.configs import router as configs_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio Resume Config MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(configs_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


if os.getenv("SERVE_FRONTEND") == "1":
    frontend_dist = Path(__file__).resolve().parents[2] / "frontend" / "dist"
    if frontend_dist.exists():
        app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
