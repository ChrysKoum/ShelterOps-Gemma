from pydantic import BaseModel


class ExportRequest(BaseModel):
    shelter_id: str = "demo-shelter"


class ExportResponse(BaseModel):
    export_type: str
    content: str
    privacy_safe: bool = True
