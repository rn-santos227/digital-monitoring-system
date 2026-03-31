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

create table if not exists public.engagement_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.condition_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.serviceability_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.asset_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.issuance_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.maintenance_types (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.incident_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investigation_statuses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================
-- TRAINING DOMAIN
-- ============================
create table if not exists public.training_records (
  id uuid primary key default gen_random_uuid(),
  record_no text not null unique,
  personnel_id uuid not null references public.personnel(id) on delete restrict,
  training_title text not null,
  training_category_id uuid null references public.training_categories(id) on delete restrict,
  level_id uuid null references public.levels(id) on delete restrict,
  start_date date null,
  end_date date null,
  status_id uuid not null references public.training_statuses(id) on delete restrict,
  certificate_no text null,
  valid_until date null,
  remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint training_records_date_check check (end_date is null or start_date is null or end_date >= start_date),
  constraint training_records_valid_until_check check (valid_until is null or end_date is null or valid_until >= end_date)
);

-- ============================
-- DEPLOYMENT DOMAIN
-- ============================
create table if not exists public.deployment_records (
  id uuid primary key default gen_random_uuid(),
  record_no text not null unique,
  personnel_id uuid not null references public.personnel(id) on delete restrict,
  deployment_area text not null,
  assignment_role text null,
  operation_name text null,
  start_date date not null,
  end_date date null,
  status_id uuid not null references public.deployment_statuses(id) on delete restrict,
  location text null,
  supervisor_id uuid null references public.personnel(id) on delete restrict,
  remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deployment_records_date_check check (end_date is null or end_date >= start_date)
);

-- ============================
-- ENGAGEMENT DOMAIN
-- ============================
create table if not exists public.engagement_records (
  id uuid primary key default gen_random_uuid(),
  record_no text not null unique,
  personnel_id uuid not null references public.personnel(id) on delete restrict,
  engagement_title text not null,
  engagement_type_id uuid not null references public.engagement_types(id) on delete restrict,
  level_id uuid null references public.levels(id) on delete restrict,
  date_start date null,
  date_end date null,
  status_id uuid not null references public.engagement_statuses(id) on delete restrict,
  remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint engagement_records_date_check check (date_end is null or date_start is null or date_end >= date_start)
);

-- ============================
-- EQUIPMENT DOMAIN
-- ============================
create table if not exists public.equipment_categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  requires_serial boolean not null default false,
  is_consumable boolean not null default false,
  is_controlled boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.equipment_items (
  id uuid primary key default gen_random_uuid(),
  equipment_code text not null unique,
  category_id uuid not null references public.equipment_categories(id) on delete restrict,
  name text not null,
  model text null,
  manufacturer text null,
  description text null,
  unit_of_measure text null,
  minimum_stock_level integer not null default 0,
  is_serialized boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint equipment_items_minimum_stock_level_check check (minimum_stock_level >= 0)
);
