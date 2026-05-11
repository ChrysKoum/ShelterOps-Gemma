---
name: shelterops-stitch-design-reader
description: Inspect Google Stitch assets and translate code.html, DESIGN.md, and screen.png references into React/Tailwind/shadcn implementation notes. Use when creating or updating docs/design-analysis.md, mapping stitch_assets folders to routes, or recreating ShelterOps Gemma visual design.
---

# Shelterops Stitch Design Reader

## Workflow

1. Enumerate every folder under `stitch_assets/`.
2. Read `code.html` when present.
3. Read `DESIGN.md` when present, especially for `emergency_operations_command`.
4. Inspect `screen.png` when present and prioritize the screenshot for visual appearance.
5. Document route mapping, page purpose, components, palette, typography, spacing, and missing assets in `docs/design-analysis.md`.

## Visual Defaults

Use Inter, JetBrains Mono for IDs/data, off-white app background, white bordered cards, deep slate primary buttons/nav, 8px radii, dense tables, pill status badges, and lucide-react icons.
