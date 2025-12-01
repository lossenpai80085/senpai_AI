from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import scans, ai
from app.database import init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(scans.router, prefix="/api/v1/scan", tags=["scan"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Senpai AI API is running"}
