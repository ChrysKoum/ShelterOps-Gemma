# Architecture

Frontend: Vite React, Tailwind CSS, React Router, lucide-react, and shadcn-style local primitives.

Backend: FastAPI with Pydantic schemas and CORS. The frontend calls FastAPI for analysis, cases, inventory, needs, public needs, exports, and settings.

Model: Ollama local HTTP API with `OLLAMA_MODEL=gemma4`. If Ollama is unavailable, the backend returns a deterministic demo response and warning.

RAG: local markdown policy files under `backend/data`. MVP retrieval uses keyword matching and returns grounding source names.

Scoring: deterministic urgency scoring combines fields and notes with safety keywords before model output is used.

Database: Supabase SQL schema and seed are included. Runtime uses in-memory fallback when Supabase credentials are missing.

Privacy: public board and public exports aggregate needs only and hide names, notes, case IDs, medical details, documents, and household-specific sensitive information.
