from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Target(Base):
    __tablename__ = "targets"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    scans = relationship("Scan", back_populates="target")

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    target_id = Column(Integer, ForeignKey("targets.id"))
    status = Column(String, default="pending") # pending, running, completed, failed
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True), nullable=True)
    modules_run = Column(JSON) # List of modules selected
    
    target = relationship("Target", back_populates="scans")
    findings = relationship("Finding", back_populates="scan")
    ai_summary = relationship("AISummary", back_populates="scan", uselist=False)

class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"))
    module = Column(String)
    raw_evidence = Column(Text) # JSON string or raw text
    
    # AI Enhanced Fields
    title = Column(String)
    severity = Column(String) # Low, Medium, High, Critical
    score = Column(Integer) # 1-10
    explanation = Column(Text)
    impact = Column(Text)
    fix = Column(Text)
    
    scan = relationship("Scan", back_populates="findings")

class AISummary(Base):
    __tablename__ = "ai_summaries"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"))
    overall_risk = Column(String) # Low, Medium, High, Critical
    summary_text = Column(Text)
    remediation_plan = Column(Text)
    top_risks = Column(JSON) # List of top risks
    
    scan = relationship("Scan", back_populates="ai_summary")
