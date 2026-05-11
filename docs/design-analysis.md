# ShelterOps Gemma Design Analysis

## Stitch Sources

| Folder | Route | Source files | Notes |
|---|---|---|---|
| `emergency_operations_command` | `/`, `/dashboard` | `DESIGN.md` | No `code.html` or `screen.png`; implemented from design-system spec. |
| `new_intake` | `/intake` | `code.html`, `screen.png` | Two-column intake and Gemma analysis preview. |
| `cases_dashboard` | `/cases` | `code.html`, `screen.png` | KPI cards, active cases roster, operations snapshot. |
| `case_details_case_014` | `/cases/:id` | `code.html`, `screen.png` | Case header, risk card, household summary, privacy banner, tabs. |
| `inventory_management` | `/inventory` | `code.html`, `screen.png` | Inventory gap KPIs, table, AI insights rail. |
| `needs_board_internal` | `/needs` | `code.html`, `screen.png` | Urgent aggregated needs cards and publication flow. |
| `public_needs_board` | `/public-needs/:shelterId` | `code.html`, `screen.png` | Public privacy-safe needs table, drop-off info, volunteer CTA. |
| `architecture_about_fixed` | `/about-demo` | `code.html`, `screen.png` | Architecture flow and judge-facing explanation cards. |

## Visual System

The Stitch screens use a calm emergency-operations SaaS style: off-white app background, white cards with thin slate borders, deep slate primary actions, compact tables, status pills, Inter typography, and JetBrains Mono for IDs and counts. Internal screens use a fixed left sidebar and top operations bar. Public views remove the sidebar and use a simpler public header.

Palette: `#fbf8fa` background, `#ffffff` cards, `#e2e8f0` and `#c5c6cd` borders, `#091426` / `#1e293b` primary slate, `#ba1a1a` critical red, `#ffdad6` critical container, `#fadfb8` high-priority amber, muted blue-gray privacy/safety accents.

## Component Mapping

| Stitch element | React implementation |
|---|---|
| Sidebar/topbar | `Shell`, nav config, status badges |
| KPI cards | `Metric` |
| Cards/panels | `Card` |
| Buttons | `Button` variants |
| Priority pills | `Badge` |
| Tables | `DataTable` |
| Intake form | `IntakePage`, `Field`, `Checklist` |
| Analysis preview | `AnalysisPanel` |
| Case detail tabs | `Tabs` |
| Public board | `PublicNeedsPage` |
| Architecture cards | `AboutDemoPage`, `InfoCard` |

## Missing Screens

`/exports` and `/settings` had no Stitch screens, so they were generated from the same card/table/sidebar design language. The emergency command folder had only `DESIGN.md`; the dashboard was generated from that design system plus the other operational screens.
