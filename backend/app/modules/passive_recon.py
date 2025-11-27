import whois
import dns.resolver
import socket
import asyncio
from typing import Dict, Any

async def run_passive_recon(domain: str) -> Dict[str, Any]:
    results = {
        "whois": {},
        "dns": {},
        "server_ip": ""
    }
    
    # WHOIS
    try:
        w = whois.whois(domain)
        results["whois"] = w
    except Exception as e:
        results["whois"] = {"error": str(e)}

    # DNS Records
    resolver = dns.resolver.Resolver()
    for record_type in ["A", "AAAA", "MX", "TXT", "NS"]:
        try:
            answers = resolver.resolve(domain, record_type)
            results["dns"][record_type] = [str(r) for r in answers]
        except Exception:
            results["dns"][record_type] = []

    # Server IP
    try:
        results["server_ip"] = socket.gethostbyname(domain)
    except Exception as e:
        results["server_ip"] = "Unknown"

    return results
