---
name: shelterops-ui-implementation
description: Build the ShelterOps Gemma Vite React frontend with Tailwind, shadcn/ui-style components, lucide-react icons, React Router pages, mock/demo data, API integration, polished dashboard layouts, and the complete intake-to-public-needs demo flow.
---

# Shelterops Ui Implementation

## Required Routes

Implement `/`, `/dashboard`, `/intake`, `/cases`, `/cases/:id`, `/inventory`, `/needs`, `/public-needs/:shelterId`, `/exports`, `/settings`, and `/about-demo`.

## Build Rules

- Use a real app shell with sidebar/topbar for internal pages.
- Use a simpler public header for `/public-needs/:shelterId`.
- Keep demo data first-class so pages render before backend is available.
- Use shadcn-like local UI primitives in `frontend/src/components/ui`.
- Use lucide-react icons for navigation, actions, and status indicators.
- Include loading skeletons, toasts, empty states, and responsive layouts.
