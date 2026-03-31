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

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  parent_unit_id uuid null references public.units(id) on delete restrict,
  unit_type text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employment_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.personnel (
  id uuid primary key default gen_random_uuid(),
  personnel_code text not null unique,
  service_number text not null unique,
  last_name text not null,
  first_name text not null,
  middle_name text null,
  sex text not null check (sex in ('Male', 'Female')),
  birthdate date null,
  rank_id uuid not null references public.ranks(id) on delete restrict,
  unit_id uuid not null references public.units(id) on delete restrict,
  employment_status_id uuid not null references public.employment_statuses(id) on delete restrict,
  service_status_id uuid not null references public.service_statuses(id) on delete restrict,
  contact_number text null,
  date_enlisted date null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================
-- SUPPORT / LOOKUP TABLES
-- ============================
create table if not exists public.levels (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.training_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.training_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deployment_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.engagement_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

