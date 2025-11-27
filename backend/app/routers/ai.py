from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel

from app.database import get_db
from app.models import Scan, Target
from app.ai.service import chat_with_scan

router = APIRouter()

class ChatRequest(BaseModel):
    scan_id: int
    question: str

@router.post("/query")
async def chat_scan(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Scan)
        .options(selectinload(Scan.findings), selectinload(Scan.target))
        .where(Scan.id == request.scan_id)
    )
    scan = result.scalars().first()
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    if scan.status != "completed":
        raise HTTPException(status_code=400, detail="Scan not completed yet")
        
    response = await chat_with_scan(scan.target.url, scan.findings, request.question)
    
    return {"answer": response}
