from backend.schemas.case import CaseCreate, CaseRecord, CaseUpdate
from backend.schemas.intake import IntakeAnalysisResponse, IntakeRequest
from backend.services.demo_service import SHELTER, demo_analysis, demo_case, utc_now


class CaseStore:
    def __init__(self) -> None:
        self.cases: dict[str, CaseRecord] = {"CASE-014": demo_case()}
        self.counter = 15

    def list_cases(self) -> list[CaseRecord]:
        return sorted(self.cases.values(), key=lambda case: case.updated_at, reverse=True)

    def get_case(self, case_id: str) -> CaseRecord:
        if case_id not in self.cases:
            raise KeyError(case_id)
        return self.cases[case_id]

    def create_case(self, payload: CaseCreate) -> CaseRecord:
        analysis = IntakeAnalysisResponse(**payload.analysis) if payload.analysis else demo_analysis()
        case_id = f"CASE-{self.counter:03d}"
        self.counter += 1
        record = CaseRecord(
            id=case_id,
            shelter_id=SHELTER.id,
            status="open",
            priority=analysis.priority_recommendation,
            urgency_score=analysis.urgency_score,
            disaster_type=payload.disaster_type,
            zone=payload.zone,
            household_size=payload.household_size,
            languages=payload.languages,
            vulnerable_people=payload.vulnerable_people,
            immediate_needs=payload.immediate_needs,
            notes_private=payload.notes,
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
        self.cases[case_id] = record
        return record

    def update_case(self, case_id: str, update: CaseUpdate) -> CaseRecord:
        record = self.get_case(case_id)
        changes = update.model_dump(exclude_unset=True)
        for key, value in changes.items():
            setattr(record, key, value)
        record.updated_at = utc_now()
        return record
