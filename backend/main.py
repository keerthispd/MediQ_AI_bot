
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.api import router as api_router
from backend.models.models import Base
from backend.models.db import engine

app = FastAPI(title="AI Medical Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Ensure DB tables exist
    Base.metadata.create_all(bind=engine)


app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok", "service": "AI Medical Assistant backend"}
