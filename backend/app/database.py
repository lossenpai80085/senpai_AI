from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models import Target, Scan, Finding, AISummary

async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    await init_beanie(
        database=client[settings.DATABASE_NAME],
        document_models=[Target, Scan, Finding, AISummary]
    )
