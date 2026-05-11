---
name: shelterops-backend-api
description: Build and maintain the ShelterOps Gemma FastAPI backend, Pydantic schemas, demo fallback endpoints, case/inventory/needs/settings/export APIs, CORS, tests, and service layer integration with Ollama, RAG, urgency scoring, privacy filtering, and Supabase fallback storage.
---

# Shelterops Backend Api

## Endpoints

Implement all `/api/*` endpoints from `guide.md`, with `/api/health` returning model/storage/demo status.

## Rules

- Frontend calls FastAPI only.
- Never expose Supabase service role keys to the frontend.
- If Supabase env vars are missing, use in-memory demo storage.
- If Ollama is unavailable, return structured fallback output with the required warning.
- Keep responses JSON-stable and demo friendly.
