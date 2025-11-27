from urllib.parse import urlparse, parse_qs
from typing import Dict, Any, List

SUSPICIOUS_PARAMS = [
    "redirect", "next", "dest", "url", "target", "r", "u", "return", "return_to",
    "file", "path", "cmd", "exec", "command", "id", "uid", "user", "admin"
]

async def run_param_abuse(url: str) -> Dict[str, Any]:
    results = {
        "params_found": [],
        "suspicious_params": []
    }
    
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    
    for param in params:
        results["params_found"].append(param)
        if param.lower() in SUSPICIOUS_PARAMS:
            results["suspicious_params"].append(param)
            
    return results
