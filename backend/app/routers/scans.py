from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from typing import List
from pydantic import BaseModel
from beanie import PydanticObjectId

from app.models import Scan, Target, Finding, AISummary
from app.services.orchestrator import run_scan
from app.services.pdf_generator import generate_pdf_report

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

@router.get("/scans")
async def get_all_scans(
    skip: int = 0,
    limit: int = 20,
    status: str = None
):
    """Get all scans with optional filtering"""
    query = Scan.find()
    
    if status and status != "all":
        query = query.find(Scan.status == status)
    
    scans = await query.skip(skip).limit(limit).to_list()
    
    # Enrich with target URLs
    result = []
    for scan in scans:
        target = await Target.get(PydanticObjectId(scan.target_id))
        result.append({
            "id": str(scan.id),
            "target": target.url if target else "Unknown",
            "status": scan.status,
            "modules": scan.modules_run,
            "created_at": scan.started_at,
            "finished_at": scan.finished_at
        })
    
    return {"scans": result, "total": len(result)}

@router.get("/{scan_id}/report/pdf")
async def download_pdf_report(scan_id: str):
    """Generate and download PDF report for a scan"""
    try:
        oid = PydanticObjectId(scan_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")
    
    scan = await Scan.get(oid)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    target = await Target.get(PydanticObjectId(scan.target_id))
    findings = await Finding.find(Finding.scan_id == str(scan.id)).to_list()
    summary = await AISummary.find_one(AISummary.scan_id == str(scan.id))
    
    # Generate PDF
    pdf_buffer = await generate_pdf_report(scan, findings, summary, target)
    
    # Return as downloadable file
    filename = f"senpai-ai-report-{target.url.replace('://', '-').replace('/', '-')}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
