---
name: shelterops-gemma-ollama
description: Implement Gemma 4 via Ollama for ShelterOps Gemma, including configurable OLLAMA_BASE_URL and OLLAMA_MODEL, strict JSON prompts, one repair attempt, fallback demo responses, model status warnings, and safety/privacy instructions.
---

# Shelterops Gemma Ollama

## Contract

Default to `OLLAMA_BASE_URL=http://localhost:11434` and `OLLAMA_MODEL=gemma4`.

The model must return only valid JSON with summary, priority recommendation, urgency flags, action tasks, supply request, handoff, SMS, English instructions, translated instructions, safety notes, and grounding sources.

## Fallback

On HTTP failure, timeout, invalid JSON after one repair attempt, or missing Ollama, return the deterministic CASE-014 demo analysis and warning: `Fallback demo response used because local model was unavailable.`
