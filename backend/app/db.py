import os
import ssl

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# TiDB/MySQL URL format: mysql+pymysql://user:password@host:port/dbname
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./local_configs.db")

connect_args = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
elif "mysql" in DATABASE_URL:
    # TiDB Cloud requires SSL. 
    # By default, pymysql will use the system's CA if ssl_verify_cert=true is in the URL.
    # However, to be safe on Cloud Run, we ensure it's handled.
    connect_args["ssl"] = {"verify_identity": True}

engine = create_engine(
    DATABASE_URL, 
    connect_args=connect_args,
    pool_pre_ping=True,  # Useful for TiDB/MySQL to handle stale connections
    pool_recycle=3600,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
