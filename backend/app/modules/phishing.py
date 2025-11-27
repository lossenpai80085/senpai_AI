import re
from urllib.parse import urlparse
from typing import Dict, Any

async def run_phishing_check(url: str) -> Dict[str, Any]:
    results = {
        "score": 0,
        "heuristics": [],
        "is_suspicious": False
    }
    
    parsed = urlparse(url)
    domain = parsed.netloc
    
    # Heuristics
    if len(domain) > 50:
        results["heuristics"].append("Long domain name")
        results["score"] += 20
        
    if domain.count("-") > 3:
        results["heuristics"].append("Multiple hyphens in domain")
        results["score"] += 20
        
    if "@" in url:
        results["heuristics"].append("URL contains @ symbol")
        results["score"] += 50
        
    if domain.replace(".", "").isdigit(): # IP address
        results["heuristics"].append("IP address used instead of domain")
        results["score"] += 30
        
    # Check for brand imitation (simple check)
    common_brands = ["google", "facebook", "apple", "microsoft", "paypal", "bank", "secure", "login", "signin"]
    for brand in common_brands:
        if brand in domain and brand != domain.split(".")[-2]: # e.g. google-login.com
             results["heuristics"].append(f"Potential brand imitation: {brand}")
             results["score"] += 40

    if results["score"] > 50:
        results["is_suspicious"] = True
        
    return results
