from backend.schemas.intake import IntakeRequest
from backend.services.urgency_service import score_intake


def test_demo_case_scores_high_or_above():
    intake = IntakeRequest(
        disaster_type="Flood",
        zone="Gym A",
        household_size=5,
        languages=["Arabic"],
        vulnerable_people=["Infant", "elderly", "chronic illness"],
        immediate_needs=["Baby formula", "Sleeping area"],
        notes="Grandmother is diabetic and forgot medication. Father lost ID.",
    )

    result = score_intake(intake)

    assert result.urgency_score >= 60
    assert result.priority == "critical"
    assert "Missing medication" in result.reasons


def test_low_risk_case_scores_low():
    intake = IntakeRequest(notes="Single adult checking in for standard shelter placement.")

    result = score_intake(intake)

    assert result.urgency_score == 0
    assert result.priority == "low"
