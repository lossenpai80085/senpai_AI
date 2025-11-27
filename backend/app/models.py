from typing import List, Optional, Dict, Any
from datetime import datetime
from beanie import Document, Link
from pydantic import BaseModel, Field

class Target(Document):
    url: str
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "targets"

class Finding(Document):
    scan_id: str # Storing as string representation of ObjectId or just a reference ID
    module: str
    raw_evidence: str # JSON string
    
    # AI Enhanced Fields
    title: Optional[str] = None
    severity: Optional[str] = None
    score: Optional[int] = None
    explanation: Optional[str] = None
    impact: Optional[str] = None
    fix: Optional[str] = None
    
    class Settings:
        name = "findings"

class AISummary(Document):
    scan_id: str
    overall_risk: Optional[str] = None
    summary_text: Optional[str] = None
    remediation_plan: Optional[str] = None
    top_risks: Optional[List[str]] = []
    
    class Settings:
        name = "ai_summaries"

class Scan(Document):
    target_id: str
    status: str = "pending"
    started_at: datetime = Field(default_factory=datetime.now)
    finished_at: Optional[datetime] = None
    modules_run: List[str] = []
    
    # We can compute findings and summary via queries, no need for direct relationship fields in basic Beanie usage
    # unless using Links, but manual query is often simpler for migration.
    
    class Settings:
        name = "scans"
