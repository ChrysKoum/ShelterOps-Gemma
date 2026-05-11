from pydantic import BaseModel, Field
from .common import Priority


class IntakeRequest(BaseModel):
    disaster_type: str = "Flood"
    zone: str = "Gym A"
    household_size: int = Field(default=1, ge=1)
    languages: list[str] = Field(default_factory=list)
    vulnerable_people: list[str] = Field(default_factory=list)
    immediate_needs: list[str] = Field(default_factory=list)
    notes: str = ""


class UrgencyFlag(BaseModel):
    label: str
    level: Priority
    reason: str
    public_shareable: bool = False


class ActionTask(BaseModel):
    task: str
    priority: Priority
    team: str
    reason: str
    status: str = "open"


class SupplyRequest(BaseModel):
    item_name: str
    category: str
    quantity: int = Field(default=1, ge=1)
    priority: Priority
    reason: str
    public_shareable: bool = True


class UrgencyResult(BaseModel):
    urgency_score: int
    priority: Priority
    reasons: list[str]
    recommended_next_action: str


class IntakeAnalysisResponse(BaseModel):
    summary: str
    priority_recommendation: Priority
    urgency_score: int
    urgency_flags: list[UrgencyFlag]
    action_tasks: list[ActionTask]
    supply_request: list[SupplyRequest]
    handoff: str
    sms: str
    family_instructions_english: str
    translated_instructions: str
    safety_notes: list[str]
    grounding_sources: list[str]
    model_status: str
    warnings: list[str] = Field(default_factory=list)
    recommended_next_action: str
