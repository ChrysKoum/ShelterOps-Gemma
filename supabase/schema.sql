create extension if not exists "pgcrypto";

create table if not exists shelters (
  id uuid primary key default gen_random_uuid(),
  name text,
  location text,
  contact_name text,
  contact_email text,
  contact_phone text,
  dropoff_instructions text,
  public_board_enabled boolean default true,
  created_at timestamp with time zone default now()
);

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  shelter_id uuid references shelters(id),
  status text,
  priority text,
  urgency_score int,
  disaster_type text,
  zone text,
  household_size int,
  languages text[],
  vulnerable_people text[],
  immediate_needs text[],
  notes_private text,
  summary text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists case_analysis (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id),
  urgency_flags jsonb,
  action_tasks jsonb,
  supply_request jsonb,
  handoff text,
  sms text,
  translated_instructions text,
  safety_notes jsonb,
  grounding_sources jsonb,
  raw_model_output jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  shelter_id uuid references shelters(id),
  item_name text,
  category text,
  in_stock int default 0,
  needed int default 0,
  unit text default 'units',
  public_shareable boolean default true,
  updated_at timestamp with time zone default now()
);

create table if not exists case_needs (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases(id),
  shelter_id uuid references shelters(id),
  item_name text,
  category text,
  quantity int,
  priority text,
  public_shareable boolean default true,
  reason text,
  created_at timestamp with time zone default now()
);

create table if not exists export_logs (
  id uuid primary key default gen_random_uuid(),
  shelter_id uuid references shelters(id),
  export_type text,
  content text,
  created_at timestamp with time zone default now()
);

create table if not exists public_board_snapshots (
  id uuid primary key default gen_random_uuid(),
  shelter_id uuid references shelters(id),
  content jsonb,
  created_at timestamp with time zone default now()
);
