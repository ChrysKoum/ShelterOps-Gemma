from backend.schemas.intake import IntakeRequest, UrgencyResult


RULES: list[tuple[list[str], int, str]] = [
    (["unconscious", "bleeding", "chest pain", "not breathing"], 50, "Life-threatening symptom mentioned"),
    (["forgot medication", "missing medication", "lost medication", "no medication"], 35, "Missing medication"),
    (["chronic illness", "diabetic", "diabetes", "dialysis", "asthma"], 25, "Chronic illness"),
    (["infant", "baby", "newborn"], 25, "Infant or baby in household"),
    (["elderly", "senior", "grandmother", "grandfather"], 20, "Elderly person in household"),
    (["pregnant"], 20, "Pregnancy support needed"),
    (["disability", "disabled", "wheelchair"], 20, "Disability access support needed"),
    (["no shelter tonight", "sleeping outside"], 20, "No shelter tonight"),
    (["no water", "dehydrated"], 20, "Water need"),
    (["medication", "medicine", "prescription"], 20, "Medication need"),
    (["language barrier", "translation", "interpreter", "arabic", "spanish", "farsi"], 10, "Language support needed"),
    (["lost id", "lost documents", "documents"], 10, "Document support needed"),
    (["anxiety", "distress", "panic"], 10, "Distress support needed"),
    (["transport", "ride", "bus"], 10, "Transport support needed"),
]


def score_intake(intake: IntakeRequest, model_flags: list[str] | None = None) -> UrgencyResult:
    text = " ".join(
        [
            intake.disaster_type,
            intake.zone,
            " ".join(intake.languages),
            " ".join(intake.vulnerable_people),
            " ".join(intake.immediate_needs),
            intake.notes,
            " ".join(model_flags or []),
        ]
    ).lower()
    score = 0
    reasons: list[str] = []
    for needles, points, reason in RULES:
        if any(needle in text for needle in needles):
            score += points
            if reason not in reasons:
                reasons.append(reason)

    if score >= 60:
        priority = "critical"
        action = "Escalate to shelter lead and medical desk for immediate human review."
    elif score >= 35:
        priority = "high"
        action = "Prioritize intake follow-up and assign medical, supplies, and translation tasks."
    elif score >= 15:
        priority = "medium"
        action = "Add to active queue and resolve supply and documentation needs this shift."
    else:
        priority = "low"
        action = "Complete standard intake follow-up during routine rounds."

    return UrgencyResult(
        urgency_score=score,
        priority=priority,
        reasons=reasons or ["No high-risk urgency rules matched"],
        recommended_next_action=action,
    )
