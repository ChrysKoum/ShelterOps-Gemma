import json
from typing import Any

import httpx

from backend.core import get_settings
from backend.schemas.intake import IntakeAnalysisResponse, IntakeRequest, UrgencyResult
from backend.services.demo_service import demo_analysis


def _prompt(intake: IntakeRequest, urgency: UrgencyResult, context: list[dict[str, str]]) -> str:
    context_text = "\n\n".join(f"Source: {c['source']}\n{c['content']}" for c in context)
    return f"""
You are ShelterOps Gemma, an emergency shelter coordination assistant. You are not a doctor and do not diagnose.
Use the intake, urgency result, and local protocol context to return only valid JSON with the required schema.
Protect privacy and mark sensitive medical/case-specific details public_shareable=false.

Intake JSON:
{intake.model_dump_json()}

Deterministic urgency JSON:
{urgency.model_dump_json()}

Protocol context:
{context_text}
"""


def _coerce_response(payload: dict[str, Any], urgency: UrgencyResult, sources: list[str], model_status: str) -> IntakeAnalysisResponse:
    payload.setdefault("priority_recommendation", urgency.priority)
    payload.setdefault("urgency_score", urgency.urgency_score)
    payload.setdefault("grounding_sources", sources)
    payload.setdefault("model_status", model_status)
    payload.setdefault("warnings", [])
    payload.setdefault("recommended_next_action", urgency.recommended_next_action)
    return IntakeAnalysisResponse(**payload)


async def analyze_with_gemma(intake: IntakeRequest, urgency: UrgencyResult, context: list[dict[str, str]]) -> IntakeAnalysisResponse:
    settings = get_settings()
    sources = [c["source"] for c in context]
    prompt = _prompt(intake, urgency, context)
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                f"{settings.ollama_base_url.rstrip('/')}/api/generate",
                json={"model": settings.ollama_model, "prompt": prompt, "format": "json", "stream": False},
            )
            response.raise_for_status()
            raw = response.json().get("response", "{}")
            try:
                payload = json.loads(raw)
            except json.JSONDecodeError:
                repair = await client.post(
                    f"{settings.ollama_base_url.rstrip('/')}/api/generate",
                    json={"model": settings.ollama_model, "prompt": f"Repair this to valid JSON only:\n{raw}", "format": "json", "stream": False},
                )
                repair.raise_for_status()
                payload = json.loads(repair.json().get("response", "{}"))
            return _coerce_response(payload, urgency, sources, "ollama")
    except Exception:
        fallback = demo_analysis(
            model_status="fallback",
            warnings=["Fallback demo response used because local model was unavailable."],
        )
        fallback.grounding_sources = sources or fallback.grounding_sources
        return fallback
