import httpx
import asyncio
from typing import List, Dict, Any

COMMON_PATHS = [
    "admin", "login", "dashboard", "config", "api", "secret", "backup", "db", 
    "test", "staging", "dev", "user", "users", "profile", "settings", "upload", 
    "uploads", "images", "static", "assets", "css", "js", "robots.txt", "sitemap.xml",
    ".env", ".git", "wp-admin", "wp-login.php", "console", "shell"
]

async def run_dir_discovery(url: str, wordlist: List[str] = None) -> List[Dict[str, Any]]:
    if wordlist is None:
        wordlist = COMMON_PATHS
    
    findings = []
    base_url = url.rstrip("/")
    
    async with httpx.AsyncClient(verify=False, follow_redirects=False) as client:
        tasks = []
        for path in wordlist:
            target_url = f"{base_url}/{path}"
            tasks.append(check_path(client, target_url))
        
        results = await asyncio.gather(*tasks)
        
        for res in results:
            if res:
                findings.append(res)
                
    return findings

async def check_path(client: httpx.AsyncClient, url: str) -> Dict[str, Any]:
    try:
        response = await client.get(url, timeout=5.0)
        if response.status_code in [200, 301, 302, 403, 401, 500]:
            return {
                "url": url,
                "status_code": response.status_code,
                "content_length": len(response.content)
            }
    except Exception:
        pass
    return None
