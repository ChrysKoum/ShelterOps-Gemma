from datetime import datetime, timezone
from copy import deepcopy

from backend.schemas.case import CaseRecord
from backend.schemas.inventory import InventoryItem
from backend.schemas.intake import (
    ActionTask,
    IntakeAnalysisResponse,
    SupplyRequest,
    UrgencyFlag,
)
from backend.schemas.settings import ShelterSettings


SHELTER = ShelterSettings()

DEMO_NOTES = (
    "Family of 5 arrived after flood evacuation. Grandmother is diabetic and forgot medication. "
    "Baby needs formula. Father lost ID. Family speaks Arabic and needs sleeping area."
)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def demo_analysis(model_status: str = "fallback", warnings: list[str] | None = None) -> IntakeAnalysisResponse:
    return IntakeAnalysisResponse(
        summary="Flood evacuation household of 5 needs sleeping placement, infant supplies, Arabic support, and medical desk review for missing diabetes medication.",
        priority_recommendation="high",
        urgency_score=72,
        urgency_flags=[
            UrgencyFlag(label="Missing diabetes medication", level="critical", reason="Medication interruption needs qualified medical review.", public_shareable=False),
            UrgencyFlag(label="Infant formula needed", level="high", reason="Baby formula requested for infant care.", public_shareable=True),
            UrgencyFlag(label="Arabic language support", level="high", reason="Family needs Arabic instructions and interpretation.", public_shareable=True),
            UrgencyFlag(label="Lost ID support", level="medium", reason="Administrative document support requested.", public_shareable=False),
        ],
        action_tasks=[
            ActionTask(task="Refer grandmother to medical desk", priority="critical", team="Medical Desk", reason="Missing diabetes medication must be reviewed by qualified staff."),
            ActionTask(task="Provide baby formula", priority="high", team="Supplies", reason="Infant care supply needed."),
            ActionTask(task="Assign sleeping area for 5", priority="high", team="Shelter Lead", reason="Household needs safe sleeping placement."),
            ActionTask(task="Provide Arabic shelter instructions", priority="high", team="Translation", reason="Arabic language support requested."),
            ActionTask(task="Record lost ID issue", priority="medium", team="Admin", reason="Documentation support may be needed later."),
        ],
        supply_request=[
            SupplyRequest(item_name="Baby formula", category="Infant Care", quantity=1, priority="high", reason="Infant in household needs formula.", public_shareable=True),
            SupplyRequest(item_name="Blankets", category="Shelter", quantity=5, priority="high", reason="One blanket per household member.", public_shareable=True),
            SupplyRequest(item_name="Sleeping mats", category="Shelter", quantity=5, priority="high", reason="Sleeping placement for household of 5.", public_shareable=True),
            SupplyRequest(item_name="Hygiene kits", category="Hygiene", quantity=5, priority="medium", reason="One hygiene kit per household member.", public_shareable=True),
        ],
        handoff="CASE-014: Flood evacuation family of 5 in Gym A. Medical desk should review missing diabetes medication. Supplies: formula, 5 blankets, 5 mats, 5 hygiene kits. Arabic instructions needed. Not a diagnosis; human review required.",
        sms="Northside School Gym: please check in at the intake desk. Staff can help with sleeping area, baby supplies, Arabic instructions, and urgent medical review.",
        family_instructions_english="Please stay near Gym A and speak with intake staff for sleeping space, baby supplies, and medical desk review. For urgent symptoms, alert staff immediately.",
        translated_instructions="يرجى البقاء بالقرب من القاعة A والتحدث مع فريق الاستقبال للحصول على مكان للنوم ومستلزمات الطفل ومراجعة المكتب الطبي. في الحالات العاجلة، أخبروا الموظفين فوراً.",
        safety_notes=[
            "This is not a medical diagnosis.",
            "Missing medication should be escalated to qualified staff.",
            "Public exports must aggregate needs and hide medical details.",
        ],
        grounding_sources=["escalation_policy.md", "supplies_policy.md", "privacy_policy.md", "translation_templates.md"],
        model_status=model_status,
        warnings=warnings or [],
        recommended_next_action="Prioritize intake follow-up and assign medical, supplies, and translation tasks.",
    )


def demo_case() -> CaseRecord:
    analysis = demo_analysis()
    return CaseRecord(
        id="CASE-014",
        shelter_id=SHELTER.id,
        status="open",
        priority="high",
        urgency_score=72,
        disaster_type="Flood",
        zone="Gym A",
        household_size=5,
        languages=["Arabic"],
        vulnerable_people=["Infant", "elderly", "chronic illness"],
        immediate_needs=["Baby formula", "Sleeping area", "Medication review", "Arabic support"],
        notes_private=DEMO_NOTES,
        summary=analysis.summary,
        updated_at=utc_now(),
        urgency_flags=analysis.urgency_flags,
        action_tasks=analysis.action_tasks,
        supply_request=analysis.supply_request,
        handoff=analysis.handoff,
        sms=analysis.sms,
        translated_instructions=analysis.translated_instructions,
        safety_notes=analysis.safety_notes,
        grounding_sources=analysis.grounding_sources,
    )


def demo_inventory() -> list[InventoryItem]:
    return [
        InventoryItem(id="inv-formula", shelter_id=SHELTER.id, item_name="Baby formula", category="Infant Care", in_stock=2, needed=10, priority="critical", public_shareable=True),
        InventoryItem(id="inv-blankets", shelter_id=SHELTER.id, item_name="Blankets", category="Shelter", in_stock=20, needed=45, priority="high", public_shareable=True),
        InventoryItem(id="inv-mats", shelter_id=SHELTER.id, item_name="Sleeping mats", category="Shelter", in_stock=12, needed=30, priority="high", public_shareable=True),
        InventoryItem(id="inv-arabic", shelter_id=SHELTER.id, item_name="Arabic-speaking volunteers", category="Language", in_stock=0, needed=3, priority="high", public_shareable=True),
        InventoryItem(id="inv-hygiene", shelter_id=SHELTER.id, item_name="Hygiene kits", category="Hygiene", in_stock=10, needed=30, priority="medium", public_shareable=True),
        InventoryItem(id="inv-medical", shelter_id=SHELTER.id, item_name="Medical desk reviews", category="Medical", in_stock=1, needed=4, priority="critical", public_shareable=False),
    ]


def fresh_demo_inventory() -> list[InventoryItem]:
    return deepcopy(demo_inventory())
