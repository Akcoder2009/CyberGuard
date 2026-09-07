import os

from sqlalchemy import create_engine  # type: ignore
from sqlalchemy.orm import declarative_base, sessionmaker  # type: ignore

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cyberguard.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()