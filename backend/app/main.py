try:
    from fastapi import FastAPI
except ImportError:
    raise RuntimeError(
        "fastapi is not installed or could not be imported. Install it with: pip install fastapi[all]"
    )

from app import models
from app.database import Base, engine
from app.routers import employees

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CyberGuard API")

app.include_router(employees.router)


@app.get("/")
def root():
    return {"status": "ok"}