import asyncio
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import Scan, Finding, AISummary, Target
from app.modules import (
    passive_recon, active_recon, dir_discovery, 
    auth_check, param_abuse, phishing, osint
)
from app.ai.service import analyze_finding, generate_scan_summary

async def run_scan(scan_id: int, db: AsyncSession):
    scan = await db.get(Scan, scan_id)
    if not scan:
        return

    scan.status = "running"
    await db.commit()
    
    target = await db.get(Target, scan.target_id)
    url = target.url
    domain = url.replace("https://", "").replace("http://", "").split("/")[0]

    modules_to_run = scan.modules_run or []
    
    tasks = []
    
    # Map module names to functions
    if "passive_recon" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "passive_recon", passive_recon.run_passive_recon, domain, db))
    if "active_recon" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "active_recon", active_recon.run_active_recon, url, db))
    if "dir_discovery" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "dir_discovery", dir_discovery.run_dir_discovery, url, db))
    if "auth_check" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "auth_check", auth_check.run_auth_check, url, db))
    if "param_abuse" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "param_abuse", param_abuse.run_param_abuse, url, db))
    if "phishing" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "phishing", phishing.run_phishing_check, url, db))
    if "osint" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "osint", osint.run_osint, domain, db))

    await asyncio.gather(*tasks)
    
    # Generate Summary
    result = await db.execute(select(Finding).where(Finding.scan_id == scan_id))
    findings = result.scalars().all()
    
    summary_data = await generate_scan_summary(findings)
    
    summary = AISummary(
        scan_id=scan_id,
        overall_risk=summary_data.get("overall_risk", "Unknown"),
        summary_text=summary_data.get("summary_text", ""),
        remediation_plan=summary_data.get("remediation_plan", ""),
        top_risks=summary_data.get("top_risks", [])
    )
    db.add(summary)
    
    scan.status = "completed"
    scan.finished_at = func.now()
    await db.commit()

async def run_module_wrapper(scan_id: int, module_name: str, module_func, target_input, db: AsyncSession):
    try:
        raw_result = await module_func(target_input)
        
        # If result is a list (like dir discovery), treat each item as a finding? 
        # Or treat the whole list as one finding evidence?
        # For simplicity, let's treat the whole result as one finding block for AI to analyze,
        # unless it's too large.
        
        # Actually, for things like dir discovery, we might want to filter.
        # But let's pass the raw result to AI.
        
        raw_json = json.dumps(raw_result, default=str)
        
        ai_analysis = await analyze_finding(module_name, raw_json)
        
        finding = Finding(
            scan_id=scan_id,
            module=module_name,
            raw_evidence=raw_json,
            title=ai_analysis.get("title", f"{module_name} Result"),
            severity=ai_analysis.get("severity", "Low"),
            score=ai_analysis.get("score", 1),
            explanation=ai_analysis.get("explanation", ""),
            impact=ai_analysis.get("impact", ""),
            fix=ai_analysis.get("fix", "")
        )
        db.add(finding)
        await db.commit()
        
    except Exception as e:
        print(f"Module {module_name} failed: {e}")

from sqlalchemy.sql import func
