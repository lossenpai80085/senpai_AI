from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List
from pydantic import BaseModel
from beanie import PydanticObjectId

from app.models import Scan, Target, Finding, AISummary
from app.services.orchestrator import run_scan

router = APIRouter()

class ScanCreate(BaseModel):
    url: str
    modules: List[str]

class ScanResponse(BaseModel):
    id: str
    status: str
    target_url: str

@router.post("/start", response_model=ScanResponse)
async def start_scan(
    scan_in: ScanCreate, 
    background_tasks: BackgroundTasks
):
    # Check if target exists, else create
    target = await Target.find_one(Target.url == scan_in.url)
    
    if not target:
        target = Target(url=scan_in.url)
        await target.create()
    
    # Create Scan
    scan = Scan(
        target_id=str(target.id),
        status="pending",
        modules_run=scan_in.modules
    )
    await scan.create()
    
    # Start Background Task
    background_tasks.add_task(run_scan, str(scan.id))
    
    return ScanResponse(id=str(scan.id), status=scan.status, target_url=target.url)

@router.get("/status/{scan_id}")
async def get_scan_status(scan_id: str):
    try:
        oid = PydanticObjectId(scan_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    scan = await Scan.get(oid)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return {"id": str(scan.id), "status": scan.status, "started_at": scan.started_at, "finished_at": scan.finished_at}

@router.get("/result/{scan_id}")
async def get_scan_result(scan_id: str):
    try:
        oid = PydanticObjectId(scan_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    scan = await Scan.get(oid)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    findings = await Finding.find(Finding.scan_id == str(scan.id)).to_list()
    summary = await AISummary.find_one(AISummary.scan_id == str(scan.id))
        
    return {
        "id": str(scan.id),
        "status": scan.status,
        "findings": findings,
        "summary": summary
    }
