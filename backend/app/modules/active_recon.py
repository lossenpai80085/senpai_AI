import httpx
from typing import Dict, Any

async def run_active_recon(url: str) -> Dict[str, Any]:
    results = {
        "headers": {},
        "technologies": [],
        "status_code": 0
    }
    
    try:
        async with httpx.AsyncClient(verify=False, follow_redirects=True) as client:
            response = await client.get(url, timeout=10.0)
            results["status_code"] = response.status_code
            results["headers"] = dict(response.headers)
            
            # Simple tech fingerprinting based on headers and content
            headers_lower = {k.lower(): v.lower() for k, v in response.headers.items()}
            content_lower = response.text.lower()
            
            if "server" in headers_lower:
                results["technologies"].append(f"Server: {headers_lower['server']}")
            if "x-powered-by" in headers_lower:
                results["technologies"].append(f"Powered By: {headers_lower['x-powered-by']}")
            
            if "react" in content_lower:
                results["technologies"].append("React")
            if "vue" in content_lower:
                results["technologies"].append("Vue.js")
            if "wordpress" in content_lower:
                results["technologies"].append("WordPress")
            if "bootstrap" in content_lower:
                results["technologies"].append("Bootstrap")
            if "jquery" in content_lower:
                results["technologies"].append("jQuery")

    except Exception as e:
        results["error"] = str(e)

    return results
