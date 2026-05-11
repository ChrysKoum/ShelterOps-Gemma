import csv
from io import StringIO

from backend.schemas.exports import ExportResponse
from backend.schemas.inventory import InventoryGap
from backend.schemas.needs import PublicNeedsBoard
from backend.services.demo_service import SHELTER


def whatsapp_callout(board: PublicNeedsBoard) -> ExportResponse:
    lines = [
        f"{SHELTER.name} needs help today.",
        f"Drop off: {SHELTER.dropoff_instructions}, {SHELTER.location}",
        "Most urgent public needs:",
    ]
    lines += [f"- {need.quantity} x {need.item_name} ({need.priority})" for need in board.needs]
    lines.append(f"Coordinator: {SHELTER.contact_email}")
    lines.append("Privacy note: this request contains aggregate needs only.")
    return ExportResponse(export_type="whatsapp_callout", content="\n".join(lines))


def ngo_email(board: PublicNeedsBoard) -> ExportResponse:
    body = [
        f"Subject: Shelter supply request - {SHELTER.name}",
        "",
        "Hello,",
        f"{SHELTER.name} at {SHELTER.location} is requesting support for aggregate shelter needs.",
        "",
    ]
    body += [f"- {need.item_name}: {need.quantity} needed ({need.priority})" for need in board.needs]
    body += [
        "",
        f"Drop-off instructions: {SHELTER.dropoff_instructions}",
        f"Coordinator: {SHELTER.contact_email}",
        "",
        "This email excludes resident names, case notes, medical details, and personal identifiers.",
    ]
    return ExportResponse(export_type="ngo_email", content="\n".join(body))


def csv_gap_report(gaps: list[InventoryGap]) -> ExportResponse:
    out = StringIO()
    writer = csv.writer(out)
    writer.writerow(["item_name", "category", "in_stock", "needed", "gap", "priority", "public_shareable"])
    for gap in gaps:
        writer.writerow([gap.item_name, gap.category, gap.in_stock, gap.needed, gap.gap, gap.priority, gap.public_shareable])
    return ExportResponse(export_type="csv_gap_report", content=out.getvalue(), privacy_safe=False)


def handoff(gaps: list[InventoryGap]) -> ExportResponse:
    urgent = [gap for gap in gaps if gap.gap > 0 and gap.priority in {"critical", "high"}]
    lines = [
        f"Shift handoff for {SHELTER.name}",
        "Human review required for medical or critical flags. AI output is operational support, not diagnosis.",
        "Open high-priority gaps:",
    ]
    lines += [f"- {gap.item_name}: gap {gap.gap} ({gap.priority})" for gap in urgent]
    return ExportResponse(export_type="shift_handoff", content="\n".join(lines), privacy_safe=False)


def public_snapshot(board: PublicNeedsBoard) -> ExportResponse:
    lines = [f"{board.shelter_name} public needs snapshot", board.privacy_promise]
    lines += [f"- {need.item_name}: {need.quantity} ({need.priority})" for need in board.needs]
    return ExportResponse(export_type="public_needs_snapshot", content="\n".join(lines))
