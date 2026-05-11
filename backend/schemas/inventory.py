from pydantic import BaseModel, Field
from .common import Priority


class InventoryItem(BaseModel):
    id: str
    shelter_id: str
    item_name: str
    category: str
    in_stock: int = Field(ge=0)
    needed: int = Field(ge=0)
    unit: str = "units"
    public_shareable: bool = True
    priority: Priority


class InventoryUpdate(BaseModel):
    in_stock: int = Field(ge=0)


class InventoryGap(BaseModel):
    item_name: str
    category: str
    in_stock: int
    needed: int
    gap: int
    priority: Priority
    public_shareable: bool
