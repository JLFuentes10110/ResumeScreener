from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import analyze
from app.config import get_settings
from app.models.schemas import HealthResponse
import logging

logging.basicConfig(level=logging.INFO)

settings = get_settings()

app = FastAPI(
    title="ScreenAI API",
    description="AI-powered resume screening backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(analyze.router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", response_model=HealthResponse, tags=["system"])
async def health():
    return HealthResponse(status="ok", version="1.0.0")
