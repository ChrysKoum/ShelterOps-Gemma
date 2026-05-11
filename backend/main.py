from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.core import get_settings
from backend.schemas.case import CaseCreate, CaseRecord, CaseUpdate
from backend.schemas.exports import ExportRequest, ExportResponse
from backend.schemas.intake import IntakeAnalysisResponse, IntakeRequest
from backend.schemas.inventory import InventoryItem, InventoryUpdate
from backend.schemas.needs import NeedItem, PublishResponse, PublicNeedsBoard
from backend.schemas.settings import ModelSettings, ShelterSettings
from backend.services.case_service import CaseStore
from backend.services.demo_service import SHELTER
from backend.services.export_service import csv_gap_report, handoff, ngo_email, public_snapshot, whatsapp_callout
from backend.services.gemma_service import analyze_with_gemma
from backend.services.inventory_service import InventoryStore
from backend.services.needs_service import aggregate_needs, public_board
from backend.services.rag_service import RagService
from backend.services.supabase_service import SupabaseService
from backend.services.urgency_service import score_intake


app = FastAPI(title="ShelterOps Gemma API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

settings = get_settings()
cases = CaseStore()
inventory = InventoryStore()
rag = RagService()
supabase = SupabaseService()
model_settings = ModelSettings(
    ollama_base_url=settings.ollama_base_url,
    ollama_model=settings.ollama_model,
    demo_mode=settings.demo_mode,
)
shelter_settings = SHELTER


@app.get("/api/health")
def health() -> dict:
    return {
        "ok": True,
        "service": "ShelterOps Gemma API",
        "mode": "demo" if settings.demo_mode else "live",
        "model": model_settings.ollama_model,
        "supabase": supabase.status(),
    }


@app.post("/api/intake/analyze", response_model=IntakeAnalysisResponse)
async def analyze_intake(payload: IntakeRequest) -> IntakeAnalysisResponse:
    urgency = score_intake(payload)
    query = " ".join(payload.immediate_needs + payload.vulnerable_people + payload.languages + [payload.notes])
    context = rag.retrieve(query)
    return await analyze_with_gemma(payload, urgency, context)


@app.post("/api/cases", response_model=CaseRecord)
def create_case(payload: CaseCreate) -> CaseRecord:
    return cases.create_case(payload)


@app.get("/api/cases", response_model=list[CaseRecord])
def list_cases() -> list[CaseRecord]:
    return cases.list_cases()


@app.get("/api/cases/{case_id}", response_model=CaseRecord)
def get_case(case_id: str) -> CaseRecord:
    try:
        return cases.get_case(case_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Case not found") from exc


@app.patch("/api/cases/{case_id}", response_model=CaseRecord)
def update_case(case_id: str, payload: CaseUpdate) -> CaseRecord:
    try:
        return cases.update_case(case_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Case not found") from exc


@app.get("/api/inventory", response_model=list[InventoryItem])
def list_inventory() -> list[InventoryItem]:
    return inventory.list_items()


@app.patch("/api/inventory/{item_id}", response_model=InventoryItem)
def update_inventory(item_id: str, payload: InventoryUpdate) -> InventoryItem:
    try:
        return inventory.update_stock(item_id, payload.in_stock)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Inventory item not found") from exc


@app.get("/api/inventory/gaps")
def inventory_gaps() -> list[dict]:
    return [gap.model_dump() for gap in inventory.gaps()]


@app.get("/api/needs", response_model=list[NeedItem])
def needs() -> list[NeedItem]:
    return aggregate_needs(inventory.gaps())


@app.get("/api/public-needs/{shelter_id}", response_model=PublicNeedsBoard)
def public_needs(shelter_id: str) -> PublicNeedsBoard:
    if shelter_id != shelter_settings.id:
        raise HTTPException(status_code=404, detail="Shelter not found")
    return public_board(inventory.gaps())


@app.post("/api/needs/publish", response_model=PublishResponse)
def publish_needs(_: ExportRequest | None = None) -> PublishResponse:
    return PublishResponse(published=True, board=public_board(inventory.gaps()))


@app.post("/api/exports/ngo-email", response_model=ExportResponse)
def export_ngo_email(_: ExportRequest) -> ExportResponse:
    return ngo_email(public_board(inventory.gaps()))


@app.post("/api/exports/whatsapp", response_model=ExportResponse)
def export_whatsapp(_: ExportRequest) -> ExportResponse:
    return whatsapp_callout(public_board(inventory.gaps()))


@app.post("/api/exports/csv", response_model=ExportResponse)
def export_csv(_: ExportRequest) -> ExportResponse:
    return csv_gap_report(inventory.gaps())


@app.post("/api/exports/handoff", response_model=ExportResponse)
def export_handoff(_: ExportRequest) -> ExportResponse:
    return handoff(inventory.gaps())


@app.post("/api/exports/public-snapshot", response_model=ExportResponse)
def export_public_snapshot(_: ExportRequest) -> ExportResponse:
    return public_snapshot(public_board(inventory.gaps()))


@app.get("/api/settings/shelter", response_model=ShelterSettings)
def get_shelter_settings() -> ShelterSettings:
    return shelter_settings


@app.patch("/api/settings/shelter", response_model=ShelterSettings)
def patch_shelter_settings(payload: ShelterSettings) -> ShelterSettings:
    global shelter_settings
    shelter_settings = payload
    return shelter_settings


@app.get("/api/settings/model", response_model=ModelSettings)
def get_model_settings() -> ModelSettings:
    return model_settings


@app.patch("/api/settings/model", response_model=ModelSettings)
def patch_model_settings(payload: ModelSettings) -> ModelSettings:
    global model_settings
    model_settings = payload
    return model_settings
