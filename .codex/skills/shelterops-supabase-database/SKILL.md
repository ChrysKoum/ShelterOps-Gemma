---
name: shelterops-supabase-database
description: Create and maintain ShelterOps Gemma Supabase schema, seed data, and backend storage service. Use when editing supabase/schema.sql, supabase/seed.sql, backend Supabase integration, or in-memory fallback behavior.
---

# Shelterops Supabase Database

## Tables

Maintain simple MVP tables: `shelters`, `cases`, `case_analysis`, `inventory_items`, `case_needs`, and `export_logs`.

## Runtime

Use `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_ANON_KEY` in the backend only. If missing, use demo in-memory storage and keep every endpoint functional.
