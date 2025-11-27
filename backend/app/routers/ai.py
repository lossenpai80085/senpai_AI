from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from beanie import PydanticObjectId

from app.models import Scan, Target, Finding
from app.ai.service import chat_with_scan

router = APIRouter()

class ChatRequest(BaseModel):
    scan_id: str
    question: str

@router.post("/query")
async def chat_scan(request: ChatRequest):
    try:
        oid = PydanticObjectId(request.scan_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    scan = await Scan.get(oid)
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
        
    if scan.status != "completed":
        raise HTTPException(status_code=400, detail="Scan not completed yet")
    
    target = await Target.get(PydanticObjectId(scan.target_id))
    findings = await Finding.find(Finding.scan_id == str(scan.id)).to_list()
        
    response = await chat_with_scan(target.url, findings, request.question)
    
    return {"answer": response}
