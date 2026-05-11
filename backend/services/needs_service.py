from backend.schemas.inventory import InventoryGap
from backend.schemas.needs import NeedItem, PublicNeedsBoard
from backend.services.demo_service import SHELTER, utc_now
from backend.services.privacy_service import public_needs_from_gaps


def aggregate_needs(gaps: list[InventoryGap]) -> list[NeedItem]:
    return [
        NeedItem(
            item_name=gap.item_name,
            category=gap.category,
            quantity=gap.gap,
            priority=gap.priority,
            public_shareable=gap.public_shareable,
            reason="Current needed total exceeds stock on hand.",
        )
        for gap in gaps
        if gap.gap > 0
    ]


def public_board(gaps: list[InventoryGap]) -> PublicNeedsBoard:
    return PublicNeedsBoard(
        shelter_id=SHELTER.id,
        shelter_name=SHELTER.name,
        location=SHELTER.location,
        dropoff_instructions=SHELTER.dropoff_instructions,
        coordinator_contact=SHELTER.contact_email,
        last_updated=utc_now(),
        needs=public_needs_from_gaps(gaps),
        privacy_promise="This board shows aggregate supply and volunteer needs only. It does not include resident names, case notes, medical details, or personal identifiers.",
    )
