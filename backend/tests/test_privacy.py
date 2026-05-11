from backend.schemas.inventory import InventoryGap
from backend.services.privacy_service import public_needs_from_gaps, scrub_text


def test_public_needs_hide_private_medical_items():
    gaps = [
        InventoryGap(item_name="Baby formula", category="Infant Care", in_stock=2, needed=10, gap=8, priority="critical", public_shareable=True),
        InventoryGap(item_name="Medical desk reviews", category="Medical", in_stock=1, needed=4, gap=3, priority="critical", public_shareable=False),
        InventoryGap(item_name="Medication support", category="Medical", in_stock=0, needed=2, gap=2, priority="high", public_shareable=True),
    ]

    public = public_needs_from_gaps(gaps)
    names = [item.item_name for item in public]

    assert names == ["Baby formula"]


def test_scrub_text_removes_contact_details():
    text = scrub_text("Call 555-123-4567 or email resident@example.com")

    assert "resident@example.com" not in text
    assert "555-123-4567" not in text
