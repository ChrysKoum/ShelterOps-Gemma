# Evaluation Plan

- Confirm `/api/health` returns OK.
- Test urgency scoring for life-threatening, medication, infant, elderly, language, document, and transport signals.
- Test privacy sanitizer removes names, contact info, raw notes, medical specifics, and case IDs from public outputs.
- Test export generation for NGO email, WhatsApp callout, CSV, handoff, and public snapshot.
- Test fallback analysis when Ollama is unavailable.
- Smoke-test frontend routes: `/`, `/intake`, `/cases`, `/cases/CASE-014`, `/inventory`, `/needs`, `/public-needs/demo-shelter`, `/exports`, `/settings`, `/about-demo`.
- Walk the 3-minute demo flow end to end.
