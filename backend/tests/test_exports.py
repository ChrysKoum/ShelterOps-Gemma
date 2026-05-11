from backend.services.demo_service import fresh_demo_inventory
from backend.services.export_service import csv_gap_report, ngo_email, whatsapp_callout
from backend.services.inventory_service import InventoryStore
from backend.services.needs_service import public_board


def test_public_exports_exclude_private_medical_gap():
    store = InventoryStore()
    board = public_board(store.gaps())

    message = whatsapp_callout(board).content
    email = ngo_email(board).content

    assert "Baby formula" in message
    assert "Medical desk reviews" not in message
    assert "resident names" in email
    assert "Medical desk reviews" not in email


def test_csv_gap_report_contains_internal_rows():
    store = InventoryStore()
    report = csv_gap_report(store.gaps())

    assert "item_name,category,in_stock,needed,gap,priority,public_shareable" in report.content
    assert "Medical desk reviews" in report.content
    assert fresh_demo_inventory()[0].item_name in report.content
