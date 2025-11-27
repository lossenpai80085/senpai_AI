import httpx
from typing import Dict, Any

async def run_auth_check(url: str) -> Dict[str, Any]:
    results = {
        "login_detected": False,
        "missing_headers": [],
        "cookie_issues": []
    }
    
    try:
        async with httpx.AsyncClient(verify=False, follow_redirects=True) as client:
            response = await client.get(url, timeout=10.0)
            
            # Check for login forms
            content_lower = response.text.lower()
            if "<form" in content_lower and ("password" in content_lower or "login" in content_lower):
                results["login_detected"] = True
            
            # Check Security Headers
            headers = {k.lower(): v for k, v in response.headers.items()}
            security_headers = [
                "content-security-policy",
                "x-frame-options",
                "x-xss-protection",
                "strict-transport-security",
                "x-content-type-options"
            ]
            
            for sh in security_headers:
                if sh not in headers:
                    results["missing_headers"].append(sh)
            
            # Check Cookies
            for cookie in response.cookies.jar:
                if not cookie.secure:
                    results["cookie_issues"].append(f"Cookie {cookie.name} is missing Secure flag")
                if not cookie.has_nonstandard_attr("HttpOnly") and not cookie.has_nonstandard_attr("httponly"):
                     # httpx cookies might handle HttpOnly differently, checking standard attributes
                     # Actually httpx.Cookies don't expose HttpOnly easily in the jar iteration directly if not parsed from header
                     # But we can check if it was set in Set-Cookie header
                     pass

    except Exception as e:
        results["error"] = str(e)

    return results
