---
name: shelterops-rag
description: Build simple local markdown RAG for ShelterOps Gemma using backend/data policy docs, keyword retrieval, source names, and prompt context. Use when creating or editing shelter protocol, escalation, supplies, privacy, translation docs, or retrieval code.
---

# Shelterops Rag

## Data Files

Maintain `backend/data/shelter_protocol.md`, `escalation_policy.md`, `supplies_policy.md`, `privacy_policy.md`, and `translation_templates.md`.

## Retrieval

Use simple keyword matching for the MVP. Return relevant chunks and grounding source names. Do not block on embeddings, ChromaDB, or FAISS.
