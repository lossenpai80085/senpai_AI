import google.generativeai as genai
import json
import os
from app.config import settings
from app.ai.prompts import CLASSIFY_FINDING_PROMPT, SCAN_SUMMARY_PROMPT, CHAT_PROMPT

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

async def analyze_finding(module: str, raw_data: str) -> dict:
    prompt = CLASSIFY_FINDING_PROMPT.format(module=module, raw_data=raw_data)
    try:
        response = await model.generate_content_async(prompt)
        text = response.text.strip()
        # Remove markdown code blocks if present
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
        return json.loads(text)
    except Exception as e:
        print(f"AI Error: {e}")
        return {
            "title": f"Raw Finding ({module})",
            "severity": "Low",
            "score": 1,
            "explanation": "AI analysis failed. Raw data preserved.",
            "impact": "Unknown",
            "fix": "Manual review required."
        }

async def generate_scan_summary(findings: list) -> dict:
    findings_summary = json.dumps([{
        "title": f.title,
        "severity": f.severity,
        "module": f.module
    } for f in findings], indent=2)
    
    prompt = SCAN_SUMMARY_PROMPT.format(findings_summary=findings_summary)
    try:
        response = await model.generate_content_async(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
        return json.loads(text)
    except Exception as e:
        print(f"AI Summary Error: {e}")
        return {
            "overall_risk": "Unknown",
            "summary_text": "AI summary generation failed.",
            "remediation_plan": "Review findings manually.",
            "top_risks": []
        }

async def chat_with_scan(target: str, findings: list, question: str) -> str:
    findings_context = json.dumps([{
        "title": f.title,
        "severity": f.severity,
        "explanation": f.explanation
    } for f in findings], indent=2)
    
    prompt = CHAT_PROMPT.format(target=target, findings=findings_context, question=question)
    try:
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        return f"Error processing your request: {e}"
