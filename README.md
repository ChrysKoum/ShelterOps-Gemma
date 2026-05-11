# ShelterOps Gemma

Local-first emergency shelter coordination dashboard powered by Gemma 4.

## Features

- Private intake form with demo scenario.
- Gemma 4 via Ollama structured analysis with fallback mode.
- Deterministic urgency scoring.
- Cases dashboard and case detail action plan.
- Inventory gaps and internal needs board.
- Privacy-safe public needs board.
- NGO, WhatsApp, CSV, handoff, and public snapshot exports.
- Supabase schema and seed, with in-memory fallback.

## MVP Checklist

- [x] Frontend routes for all required pages.
- [x] FastAPI backend endpoints.
- [x] RAG markdown docs.
- [x] Urgency scoring.
- [x] Privacy sanitizer.
- [x] Demo data and fallback mode.
- [x] Supabase schema and seed.
- [x] Hackathon docs.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

## Environment

Backend variables are documented in `backend/.env.example`:

```bash
DEMO_MODE=true
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma4
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=
```

Frontend can set:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Demo Flow

Open `/intake`, load the demo scenario, analyze, save the case, review `CASE-014`, inspect inventory gaps, generate an external request on `/needs`, and open `/public-needs/demo-shelter`.

## Safety

ShelterOps Gemma does not diagnose. It organizes shelter operations and escalates medical risks to qualified human staff. Public views and exports are aggregate-only and privacy filtered.
