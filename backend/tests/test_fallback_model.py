import asyncio

from backend.schemas.intake import IntakeRequest
from backend.services.gemma_service import analyze_with_gemma
from backend.services.urgency_service import score_intake


def test_gemma_fallback_returns_structured_demo_response():
    intake = IntakeRequest(
        household_size=5,
        languages=["Arabic"],
        vulnerable_people=["Infant", "elderly", "chronic illness"],
        notes="Grandmother is diabetic and forgot medication. Baby needs formula.",
    )
    urgency = score_intake(intake)

    result = asyncio.run(
        analyze_with_gemma(
            intake,
            urgency,
            [{"source": "test.md", "content": "missing medication requires medical desk"}],
        )
    )

    assert result.model_status in {"fallback", "ollama"}
    assert result.summary
    assert result.supply_request
    if result.model_status == "fallback":
        assert "Fallback demo response used because local model was unavailable." in result.warnings
