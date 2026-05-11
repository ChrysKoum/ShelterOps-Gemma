import re

from backend.schemas.inventory import InventoryGap
from backend.schemas.needs import PublicNeedItem


SENSITIVE_WORDS = {
    "diabetes",
    "diabetic",
    "medication",
    "medicine",
    "prescription",
    "medical",
    "id",
    "documents",
    "phone",
    "email",
    "address",
}


def scrub_text(text: str) -> str:
    text = re.sub(r"[\w\.-]+@[\w\.-]+", "[redacted]", text)
    text = re.sub(r"\b(?:\+?\d[\d\s().-]{7,}\d)\b", "[redacted]", text)
    return text


def is_public_safe(item_name: str, public_shareable: bool = True) -> bool:
    if not public_shareable:
        return False
    lower = item_name.lower()
    return not any(word in lower for word in SENSITIVE_WORDS)


def public_needs_from_gaps(gaps: list[InventoryGap]) -> list[PublicNeedItem]:
    public: list[PublicNeedItem] = []
    for gap in gaps:
        if gap.gap <= 0 or not is_public_safe(gap.item_name, gap.public_shareable):
            continue
        public.append(
            PublicNeedItem(
                item_name=scrub_text(gap.item_name),
                category=gap.category,
                quantity=gap.gap,
                priority=gap.priority,
            )
        )
    return public
