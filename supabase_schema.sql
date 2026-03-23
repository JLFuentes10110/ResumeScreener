-- Run this in your Supabase SQL editor
-- Dashboard → SQL Editor → New Query → paste → Run

create table if not exists analyses (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  score       integer not null check (score >= 0 and score <= 100),
  verdict     text,
  summary     text,
  result      jsonb not null,
  resume_name text,
  job_snippet text
);

-- Index for ordering history
create index if not exists analyses_created_at_idx on analyses (created_at desc);

-- Optional: enable Row Level Security if you add auth later
-- alter table analyses enable row level security;
