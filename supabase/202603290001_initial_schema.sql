-- Initial backend foundation schema for
-- DIGITAL AFP PERSONNEL AND EQUIPMENT MONITORING SYSTEM

create extension if not exists pgcrypto;

-- Reusable updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================
-- MASTER TABLES
-- ============================
create table if not exists public.ranks (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


