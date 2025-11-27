import asyncio
import json
from datetime import datetime
from app.models import Scan, Finding, AISummary, Target
from app.modules import (
    passive_recon, active_recon, dir_discovery, 
    auth_check, param_abuse, phishing, osint
)
from app.ai.service import analyze_finding, generate_scan_summary
from beanie import PydanticObjectId

async def run_scan(scan_id: str):
    scan = await Scan.get(PydanticObjectId(scan_id))
    if not scan:
        return

    scan.status = "running"
    await scan.save()
    
    target = await Target.get(PydanticObjectId(scan.target_id))
    url = target.url
    domain = url.replace("https://", "").replace("http://", "").split("/")[0]

    modules_to_run = scan.modules_run or []
    
    tasks = []
    
    # Map module names to functions
    if "passive_recon" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "passive_recon", passive_recon.run_passive_recon, domain))
    if "active_recon" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "active_recon", active_recon.run_active_recon, url))
    if "dir_discovery" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "dir_discovery", dir_discovery.run_dir_discovery, url))
    if "auth_check" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "auth_check", auth_check.run_auth_check, url))
    if "param_abuse" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "param_abuse", param_abuse.run_param_abuse, url))
    if "phishing" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "phishing", phishing.run_phishing_check, url))
    if "osint" in modules_to_run:
        tasks.append(run_module_wrapper(scan_id, "osint", osint.run_osint, domain))

    await asyncio.gather(*tasks)
    
    # Generate Summary
    findings = await Finding.find(Finding.scan_id == str(scan_id)).to_list()
    
    summary_data = await generate_scan_summary(findings)
    
    summary = AISummary(
        scan_id=str(scan_id),
        overall_risk=summary_data.get("overall_risk", "Unknown"),
        summary_text=summary_data.get("summary_text", ""),
        remediation_plan=summary_data.get("remediation_plan", ""),
        top_risks=summary_data.get("top_risks", [])
    )
    await summary.create()
    
    scan.status = "completed"
    scan.finished_at = datetime.now()
    await scan.save()

async def run_module_wrapper(scan_id: str, module_name: str, module_func, target_input):
    try:
        raw_result = await module_func(target_input)
        
        raw_json = json.dumps(raw_result, default=str)
        
        ai_analysis = await analyze_finding(module_name, raw_json)
        
        finding = Finding(
            scan_id=str(scan_id),
            module=module_name,
            raw_evidence=raw_json,
            title=ai_analysis.get("title", f"{module_name} Result"),
            severity=ai_analysis.get("severity", "Low"),
            score=ai_analysis.get("score", 1),
            explanation=ai_analysis.get("explanation", ""),
            impact=ai_analysis.get("impact", ""),
            fix=ai_analysis.get("fix", "")
        )
        await finding.create()
        
    except Exception as e:
        print(f"Module {module_name} failed: {e}")
