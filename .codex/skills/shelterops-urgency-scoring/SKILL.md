---
name: shelterops-urgency-scoring
description: Implement deterministic ShelterOps urgency scoring independent of LLM output. Use when editing backend urgency logic, intake analysis, tests, priority badges, or demo expectations for urgency_score, priority, reasons, and recommended_next_action.
---

# Shelterops Urgency Scoring

## Scoring

Add points for the terms and fields in `guide.md`: life-threatening +50, missing medication +35, chronic illness +25, infant/baby +25, elderly/pregnant/disability/no shelter/no water/medication need +20, language barrier/lost documents/anxiety/transport +10.

## Priority

60+ critical, 35-59 high, 15-34 medium, 0-14 low. Return score, priority, reasons, and recommended next action.
