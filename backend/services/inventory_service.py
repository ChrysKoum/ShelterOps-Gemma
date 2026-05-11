from backend.schemas.inventory import InventoryGap, InventoryItem
from backend.services.demo_service import fresh_demo_inventory


class InventoryStore:
    def __init__(self) -> None:
        self.items: list[InventoryItem] = fresh_demo_inventory()

    def list_items(self) -> list[InventoryItem]:
        return self.items

    def update_stock(self, item_id: str, in_stock: int) -> InventoryItem:
        for item in self.items:
            if item.id == item_id:
                item.in_stock = in_stock
                return item
        raise KeyError(item_id)

    def gaps(self) -> list[InventoryGap]:
        gaps: list[InventoryGap] = []
        for item in self.items:
            gap = max(item.needed - item.in_stock, 0)
            gaps.append(
                InventoryGap(
                    item_name=item.item_name,
                    category=item.category,
                    in_stock=item.in_stock,
                    needed=item.needed,
                    gap=gap,
                    priority=item.priority,
                    public_shareable=item.public_shareable,
                )
            )
        return gaps
