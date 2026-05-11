from pydantic import BaseModel
from .common import Priority


class NeedItem(BaseModel):
    item_name: str
    category: str
    quantity: int
    priority: Priority
    public_shareable: bool = True
    reason: str = ""


class PublicNeedItem(BaseModel):
    item_name: str
    category: str
    quantity: int
    priority: Priority


class PublicNeedsBoard(BaseModel):
    shelter_id: str
    shelter_name: str
    location: str
    dropoff_instructions: str
    coordinator_contact: str
    last_updated: str
    needs: list[PublicNeedItem]
    privacy_promise: str


class PublishResponse(BaseModel):
    published: bool
    board: PublicNeedsBoard
