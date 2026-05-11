# ShelterOps Gemma

## Local-first AI coordination for emergency shelters

Emergency shelters often depend on volunteers who are processing intake forms, supply requests, translation needs, and medical escalations at the same time. The problem is not a lack of compassion; it is operational overload. Messy notes can hide urgent needs, and public calls for help can accidentally expose private resident information.

ShelterOps Gemma is a local-first emergency shelter coordination dashboard powered by Gemma 4. It is not a generic chatbot. It is an operations tool that turns private intake into structured triage, action queues, supply requests, translations, shift handoffs, inventory gaps, and privacy-safe public needs boards.

The demo follows one core flow: a volunteer enters a private intake for a family arriving after a flood. Gemma 4 analyzes the notes with local shelter policy context. Deterministic urgency scoring flags missing medication, infant needs, Arabic language support, and lost ID support. Staff then save the case, review an action queue, see inventory gaps, publish aggregate needs, and generate an external volunteer request without exposing private details.

The architecture is intentionally practical for shelters. The frontend is Vite React with Tailwind and shadcn-style components. The backend is FastAPI. The model runs through Ollama with `OLLAMA_MODEL=gemma4`. Local markdown RAG files provide shelter protocol, escalation policy, supplies policy, privacy policy, and translation templates. Supabase schema and seed files are included for persistence, but the app also runs in demo mode with in-memory fallback when credentials are missing.

Gemma 4 is used for structured operational output: summary, priority recommendation, urgency flags, action tasks, supply requests, handoff, SMS, translated family instructions, safety notes, and grounding sources. The model is prompted to return strict JSON, avoid diagnosis, escalate medical risks to humans, and protect privacy. If Ollama is unavailable, the API returns a deterministic fallback so the demo still works.

Safety is handled in layers. Urgency scoring does not rely only on the model. Medical risks are escalated rather than diagnosed. Public needs boards and exports show only aggregate item and volunteer needs, quantities, priorities, drop-off instructions, coordinator contact, and timestamps. They hide names, raw notes, case IDs, medical details, documents, and household-specific sensitive information.

Evaluation focuses on the full demo flow, valid JSON outputs, urgency scoring accuracy on known scenarios, privacy sanitization, export generation, and graceful fallback behavior. Limitations include dependence on local hardware for inference speed and the need for human review before operational decisions.

Future work includes a Cactus-ready mobile workflow, LiteRT edge deployment, and Unsloth fine-tuning for more reliable structured shelter outputs.
