from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from pydantic import BaseModel

from app.database import get_db
from app.models import Scan, Target, Finding, AISummary
from app.services.orchestrator import run_scan

router = APIRouter()

class ScanCreate(BaseModel):
    url: str
    modules: List[str]

class ScanResponse(BaseModel):
    id: int
    status: str
    target_url: str

@router.post("/start", response_model=ScanResponse)
async def start_scan(
    scan_in: ScanCreate, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    # Check if target exists, else create
    result = await db.execute(select(Target).where(Target.url == scan_in.url))
    target = result.scalars().first()
    
    if not target:
        target = Target(url=scan_in.url)
        db.add(target)
        await db.commit()
        await db.refresh(target)
    
    # Create Scan
    scan = Scan(
        target_id=target.id,
        status="pending",
        modules_run=scan_in.modules
    )
    db.add(scan)
    await db.commit()
    await db.refresh(scan)
    
    # Start Background Task
    background_tasks.add_task(run_scan, scan.id, db)
    
    return ScanResponse(id=scan.id, status=scan.status, target_url=target.url)

@router.get("/status/{scan_id}")
async def get_scan_status(scan_id: int, db: AsyncSession = Depends(get_db)):
    scan = await db.get(Scan, scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return {"id": scan.id, "status": scan.status, "started_at": scan.started_at, "finished_at": scan.finished_at}

@router.get("/result/{scan_id}")
async def get_scan_result(scan_id: int, db: AsyncSession = Depends(get_db)):
    # Load scan with findings and summary
    result = await db.execute(
        select(Scan)
        .options(selectinload(Scan.findings), selectinload(Scan.ai_summary))
        .where(Scan.id == scan_id)
    )
    scan = result.scalars().first()
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    return {
        "id": scan.id,
        "status": scan.status,
        "findings": scan.findings,
        "summary": scan.ai_summary
    }
