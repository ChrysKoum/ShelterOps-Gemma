from pydantic import BaseModel, Field
from .common import CaseStatus, Priority
from .intake import ActionTask, SupplyRequest, UrgencyFlag


class CaseCreate(BaseModel):
    disaster_type: str = "Flood"
    zone: str = "Gym A"
    household_size: int = Field(default=1, ge=1)
    languages: list[str] = Field(default_factory=list)
    vulnerable_people: list[str] = Field(default_factory=list)
    immediate_needs: list[str] = Field(default_factory=list)
    notes: str = ""
    analysis: dict | None = None


class CaseUpdate(BaseModel):
    status: CaseStatus | None = None
    priority: Priority | None = None
    zone: str | None = None


class CaseRecord(BaseModel):
    id: str
    shelter_id: str
    status: CaseStatus
    priority: Priority
    urgency_score: int
    disaster_type: str
    zone: str
    household_size: int
    languages: list[str]
    vulnerable_people: list[str]
    immediate_needs: list[str]
    notes_private: str
    summary: str
    updated_at: str
    urgency_flags: list[UrgencyFlag] = Field(default_factory=list)
    action_tasks: list[ActionTask] = Field(default_factory=list)
    supply_request: list[SupplyRequest] = Field(default_factory=list)
    handoff: str = ""
    sms: str = ""
    translated_instructions: str = ""
    safety_notes: list[str] = Field(default_factory=list)
    grounding_sources: list[str] = Field(default_factory=list)
