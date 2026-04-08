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

create table if not exists public.battalions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  battalion_id uuid null references public.battalions(id) on delete restrict,
  code text not null unique,
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employment_statuses (
  id uuid primary key default gen_random_uuid(),
  battalion_id uuid null references public.battalions(id) on delete restrict,
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
  company_id uuid null references public.companies(id) on delete restrict,
  battalion_id uuid null references public.battalions(id) on delete restrict,
  employment_status_id uuid not null references public.employment_statuses(id) on delete restrict,
  service_status_id uuid not null references public.service_statuses(id) on delete restrict,
  contact_number text null,
  date_enlisted date null,
  constraint personnel_unit_assignment_check check (
    company_id is not null or battalion_id is not null
  ),
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

create table if not exists public.equipment_assets (
  id uuid primary key default gen_random_uuid(),
  asset_tag text not null unique,
  equipment_item_id uuid not null references public.equipment_items(id) on delete restrict,
  serial_no text null,
  batch_no text null,
  procurement_date date null,
  acquisition_cost numeric(14,2) null,
  fund_source text null,
  assigned_personnel_id uuid null references public.personnel(id) on delete restrict,
  assigned_company_id uuid null references public.companies(id) on delete restrict,
  assigned_battalion_id uuid null references public.battalions(id) on delete restrict,
  current_location text null,
  condition_status_id uuid null references public.condition_statuses(id) on delete restrict,
  serviceability_status_id uuid null references public.serviceability_statuses(id) on delete restrict,
  asset_status_id uuid not null references public.asset_statuses(id) on delete restrict,
  remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint equipment_assets_acquisition_cost_check check (acquisition_cost is null or acquisition_cost >= 0)
);

comment on table public.equipment_assets is
'Business rule for app validation: if linked equipment_items.is_serialized = true, serial_no should be present.';

-- ============================
-- EQUIPMENT ISSUANCE
-- ============================
create table if not exists public.equipment_issuances (
  id uuid primary key default gen_random_uuid(),
  issue_no text not null unique,
  equipment_asset_id uuid not null references public.equipment_assets(id) on delete restrict,
  issued_to_personnel_id uuid not null references public.personnel(id) on delete restrict,
  issued_by_personnel_id uuid null references public.personnel(id) on delete restrict,
  issue_date date not null,
  expected_return_date date null,
  actual_return_date date null,
  issue_purpose text null,
  deployment_id uuid null references public.deployment_records(id) on delete set null,
  status_id uuid not null references public.issuance_statuses(id) on delete restrict,
  condition_on_issue_id uuid null references public.condition_statuses(id) on delete restrict,
  condition_on_return_id uuid null references public.condition_statuses(id) on delete restrict,
  remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint equipment_issuances_actual_return_date_check check (
    actual_return_date is null or actual_return_date >= issue_date
  ),
  constraint equipment_issuances_expected_return_date_check check (
    expected_return_date is null or expected_return_date >= issue_date
  )
);


comment on table public.equipment_issuances is
'App-level rules: only one active/open issuance per asset at a time; only serviceable assets should normally be issued.';

-- ============================
-- MAINTENANCE DOMAIN
-- ============================
create table if not exists public.equipment_maintenance_records (
  id uuid primary key default gen_random_uuid(),
  maintenance_no text not null unique,
  equipment_asset_id uuid not null references public.equipment_assets(id) on delete restrict,
  maintenance_type_id uuid not null references public.maintenance_types(id) on delete restrict,
  reported_date date null,
  scheduled_date date null,
  completed_date date null,
  performed_by text null,
  cost numeric(14,2) null,
  findings text null,
  action_taken text null,
  resulting_condition_status_id uuid null references public.condition_statuses(id) on delete restrict,
  resulting_serviceability_status_id uuid null references public.serviceability_statuses(id) on delete restrict,
  remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint equipment_maintenance_records_cost_check check (cost is null or cost >= 0),
  constraint equipment_maintenance_records_completed_date_check check (
    completed_date is null or reported_date is null or completed_date >= reported_date
  )
);

-- ============================
-- INCIDENT TRACKING
-- ============================
create table if not exists public.equipment_incidents (
  id uuid primary key default gen_random_uuid(),
  incident_no text not null unique,
  equipment_asset_id uuid not null references public.equipment_assets(id) on delete restrict,
  personnel_id uuid null references public.personnel(id) on delete set null,
  deployment_id uuid null references public.deployment_records(id) on delete set null,
  incident_type_id uuid not null references public.incident_types(id) on delete restrict,
  incident_date date not null,
  location text null,
  description text not null,
  investigation_status_id uuid null references public.investigation_statuses(id) on delete restrict,
  resolution text null,
  remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================
-- PERSONNEL READINESS
-- ============================
create table if not exists public.personnel_qualifications (
  id uuid primary key default gen_random_uuid(),
  personnel_id uuid not null references public.personnel(id) on delete restrict,
  qualification_type text not null,
  date_obtained date null,
  valid_until date null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint personnel_qualifications_validity_check check (
    valid_until is null or date_obtained is null or valid_until >= date_obtained
  )
);

create table if not exists public.personnel_medical_readiness (
  id uuid primary key default gen_random_uuid(),
  personnel_id uuid not null references public.personnel(id) on delete restrict,
  medical_status text not null,
  fit_for_deployment boolean not null default false,
  last_exam_date date null,
  next_exam_date date null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint personnel_medical_readiness_exam_date_check check (
    next_exam_date is null or last_exam_date is null or next_exam_date >= last_exam_date
  )
);


create table if not exists public.personnel_weapon_assignments (
  id uuid primary key default gen_random_uuid(),
  personnel_id uuid not null references public.personnel(id) on delete restrict,
  equipment_asset_id uuid not null references public.equipment_assets(id) on delete restrict,
  assignment_date date not null,
  relieved_date date null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint personnel_weapon_assignments_date_check check (
    relieved_date is null or relieved_date >= assignment_date
  )
);

comment on table public.personnel_weapon_assignments is
'App-level rule: weapon assignments should reference weapon-class assets/items only.';

-- ============================
-- ASSIGNMENT VALIDATION FUNCTIONS
-- ============================
create or replace function public.validate_equipment_asset_assignment()
returns trigger
language plpgsql
as $$
declare
  v_company_battalion_id uuid;
  v_personnel_company_id uuid;
  v_personnel_battalion_id uuid;
begin
  if new.assigned_company_id is not null then
    select c.battalion_id into v_company_battalion_id
    from public.companies c
    where c.id = new.assigned_company_id;

    if new.assigned_battalion_id is not null and v_company_battalion_id is distinct from new.assigned_battalion_id then
      raise exception 'Assigned company must belong to the assigned battalion';
    end if;
  end if;

  if new.assigned_personnel_id is not null then
    select p.company_id, coalesce(p.battalion_id, c.battalion_id)
      into v_personnel_company_id, v_personnel_battalion_id
    from public.personnel p
    left join public.companies c on c.id = p.company_id
    where p.id = new.assigned_personnel_id;

    if new.assigned_company_id is not null and v_personnel_company_id is distinct from new.assigned_company_id then
      raise exception 'Assigned personnel must belong to the assigned company';
    end if;

    if new.assigned_battalion_id is not null and v_personnel_battalion_id is distinct from new.assigned_battalion_id then
      raise exception 'Assigned personnel must belong to the assigned battalion';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.validate_equipment_issuance_assignment()
returns trigger
language plpgsql
as $$
declare
  v_asset_company_id uuid;
  v_asset_battalion_id uuid;
  v_personnel_company_id uuid;
  v_personnel_battalion_id uuid;
begin
  select ea.assigned_company_id, ea.assigned_battalion_id
    into v_asset_company_id, v_asset_battalion_id
  from public.equipment_assets ea
  where ea.id = new.equipment_asset_id;

  select p.company_id, coalesce(p.battalion_id, c.battalion_id)
    into v_personnel_company_id, v_personnel_battalion_id
  from public.personnel p
  left join public.companies c on c.id = p.company_id
  where p.id = new.issued_to_personnel_id;

  if v_asset_company_id is not null and v_personnel_company_id is distinct from v_asset_company_id then
    raise exception 'Equipment assigned to a company can only be issued to personnel from that company';
  end if;

  if v_asset_battalion_id is not null and v_personnel_battalion_id is distinct from v_asset_battalion_id then
    raise exception 'Equipment assigned to a battalion can only be issued within that battalion';
  end if;

  return new;
end;
$$;

-- ============================
-- INDEXES (all FKs + common filters)
-- ============================
create index if not exists idx_companies_battalion_id on public.companies(battalion_id);

create index if not exists idx_personnel_rank_id on public.personnel(rank_id);
create index if not exists idx_personnel_company_id on public.personnel(company_id);
create index if not exists idx_personnel_battalion_id on public.personnel(battalion_id);
create index if not exists idx_personnel_employment_status_id on public.personnel(employment_status_id);
create index if not exists idx_personnel_service_status_id on public.personnel(service_status_id);
create index if not exists idx_personnel_last_name on public.personnel(last_name);

create index if not exists idx_training_records_personnel_id on public.training_records(personnel_id);
create index if not exists idx_training_records_training_category_id on public.training_records(training_category_id);
create index if not exists idx_training_records_level_id on public.training_records(level_id);
create index if not exists idx_training_records_status_id on public.training_records(status_id);
create index if not exists idx_training_records_start_date on public.training_records(start_date);

create index if not exists idx_deployment_records_personnel_id on public.deployment_records(personnel_id);
create index if not exists idx_deployment_records_supervisor_id on public.deployment_records(supervisor_id);
create index if not exists idx_deployment_records_status_id on public.deployment_records(status_id);
create index if not exists idx_deployment_records_start_date on public.deployment_records(start_date);

create index if not exists idx_engagement_records_personnel_id on public.engagement_records(personnel_id);
create index if not exists idx_engagement_records_engagement_type_id on public.engagement_records(engagement_type_id);
create index if not exists idx_engagement_records_level_id on public.engagement_records(level_id);
create index if not exists idx_engagement_records_status_id on public.engagement_records(status_id);

create index if not exists idx_equipment_items_category_id on public.equipment_items(category_id);
create index if not exists idx_equipment_items_is_active on public.equipment_items(is_active);

create index if not exists idx_equipment_assets_equipment_item_id on public.equipment_assets(equipment_item_id);
create index if not exists idx_equipment_assets_assigned_personnel_id on public.equipment_assets(assigned_personnel_id);
create index if not exists idx_equipment_assets_assigned_company_id on public.equipment_assets(assigned_company_id);
create index if not exists idx_equipment_assets_assigned_battalion_id on public.equipment_assets(assigned_battalion_id);
create index if not exists idx_equipment_assets_condition_status_id on public.equipment_assets(condition_status_id);
create index if not exists idx_equipment_assets_serviceability_status_id on public.equipment_assets(serviceability_status_id);
create index if not exists idx_equipment_assets_asset_status_id on public.equipment_assets(asset_status_id);

create index if not exists idx_equipment_issuances_equipment_asset_id on public.equipment_issuances(equipment_asset_id);
create index if not exists idx_equipment_issuances_issued_to_personnel_id on public.equipment_issuances(issued_to_personnel_id);
create index if not exists idx_equipment_issuances_issued_by_personnel_id on public.equipment_issuances(issued_by_personnel_id);
create index if not exists idx_equipment_issuances_deployment_id on public.equipment_issuances(deployment_id);
create index if not exists idx_equipment_issuances_status_id on public.equipment_issuances(status_id);
create index if not exists idx_equipment_issuances_expected_return_date on public.equipment_issuances(expected_return_date);

create index if not exists idx_equipment_maintenance_records_equipment_asset_id on public.equipment_maintenance_records(equipment_asset_id);
create index if not exists idx_equipment_maintenance_records_maintenance_type_id on public.equipment_maintenance_records(maintenance_type_id);

create index if not exists idx_equipment_incidents_equipment_asset_id on public.equipment_incidents(equipment_asset_id);
create index if not exists idx_equipment_incidents_personnel_id on public.equipment_incidents(personnel_id);
create index if not exists idx_equipment_incidents_deployment_id on public.equipment_incidents(deployment_id);
create index if not exists idx_equipment_incidents_incident_type_id on public.equipment_incidents(incident_type_id);
create index if not exists idx_equipment_incidents_investigation_status_id on public.equipment_incidents(investigation_status_id);

create index if not exists idx_personnel_qualifications_personnel_id on public.personnel_qualifications(personnel_id);
create index if not exists idx_personnel_medical_readiness_personnel_id on public.personnel_medical_readiness(personnel_id);
create index if not exists idx_personnel_weapon_assignments_personnel_id on public.personnel_weapon_assignments(personnel_id);
create index if not exists idx_personnel_weapon_assignments_equipment_asset_id on public.personnel_weapon_assignments(equipment_asset_id);

-- ============================
-- UPDATED_AT TRIGGERS
-- ============================
create trigger set_updated_at_ranks before update on public.ranks
for each row execute function public.set_updated_at();
create trigger set_updated_at_companies before update on public.companies
for each row execute function public.set_updated_at();
create trigger set_updated_at_battalions before update on public.battalions
for each row execute function public.set_updated_at();
create trigger set_updated_at_employment_statuses before update on public.employment_statuses
for each row execute function public.set_updated_at();
create trigger set_updated_at_service_statuses before update on public.service_statuses
for each row execute function public.set_updated_at();
create trigger set_updated_at_personnel before update on public.personnel
for each row execute function public.set_updated_at();

create or replace function public.validate_personnel_unit_assignment()
returns trigger
language plpgsql
as $$
declare
  v_company_battalion_id uuid;
begin
  if new.company_id is not null then
    select c.battalion_id into v_company_battalion_id
    from public.companies c
    where c.id = new.company_id;

    if new.battalion_id is not null and v_company_battalion_id is distinct from new.battalion_id then
      raise exception 'Personnel battalion must match the selected company battalion';
    end if;
  end if;

  return new;
end;
$$;

create trigger tr_validate_personnel_unit_assignment
before insert or update on public.personnel
for each row execute function public.validate_personnel_unit_assignment();
create trigger set_updated_at_levels before update on public.levels
for each row execute function public.set_updated_at();
create trigger set_updated_at_training_categories before update on public.training_categories
for each row execute function public.set_updated_at();
create trigger set_updated_at_training_statuses before update on public.training_statuses
for each row execute function public.set_updated_at();
create trigger set_updated_at_deployment_statuses before update on public.deployment_statuses
for each row execute function public.set_updated_at();
create trigger set_updated_at_engagement_types before update on public.engagement_types
for each row execute function public.set_updated_at();
create trigger set_updated_at_engagement_statuses before update on public.engagement_statuses
for each row execute function public.set_updated_at();
create trigger set_updated_at_condition_statuses before update on public.condition_statuses
for each row execute function public.set_updated_at();
create trigger set_updated_at_serviceability_statuses before update on public.serviceability_statuses
for each row execute function public.set_updated_at();
create trigger set_updated_at_asset_statuses before update on public.asset_statuses
for each row execute function public.set_updated_at();
create trigger set_updated_at_issuance_statuses before update on public.issuance_statuses
for each row execute function public.set_updated_at();
create trigger set_updated_at_maintenance_types before update on public.maintenance_types
for each row execute function public.set_updated_at();
create trigger set_updated_at_incident_types before update on public.incident_types
for each row execute function public.set_updated_at();
create trigger set_updated_at_investigation_statuses before update on public.investigation_statuses
for each row execute function public.set_updated_at();
create trigger set_updated_at_training_records before update on public.training_records
for each row execute function public.set_updated_at();
create trigger set_updated_at_deployment_records before update on public.deployment_records
for each row execute function public.set_updated_at();
create trigger set_updated_at_engagement_records before update on public.engagement_records
for each row execute function public.set_updated_at();
create trigger set_updated_at_equipment_categories before update on public.equipment_categories
for each row execute function public.set_updated_at();
create trigger set_updated_at_equipment_items before update on public.equipment_items
for each row execute function public.set_updated_at();
create trigger set_updated_at_equipment_assets before update on public.equipment_assets
for each row execute function public.set_updated_at();
create trigger tr_validate_equipment_asset_assignment
before insert or update on public.equipment_assets
for each row execute function public.validate_equipment_asset_assignment();
create trigger set_updated_at_equipment_issuances before update on public.equipment_issuances
for each row execute function public.set_updated_at();
create trigger tr_validate_equipment_issuance_assignment
before insert or update on public.equipment_issuances
for each row execute function public.validate_equipment_issuance_assignment();
create trigger set_updated_at_equipment_maintenance_records before update on public.equipment_maintenance_records
for each row execute function public.set_updated_at();
create trigger set_updated_at_equipment_incidents before update on public.equipment_incidents
for each row execute function public.set_updated_at();
create trigger set_updated_at_personnel_qualifications before update on public.personnel_qualifications
for each row execute function public.set_updated_at();
create trigger set_updated_at_personnel_medical_readiness before update on public.personnel_medical_readiness
for each row execute function public.set_updated_at();
create trigger set_updated_at_personnel_weapon_assignments before update on public.personnel_weapon_assignments
for each row execute function public.set_updated_at();

-- ============================
-- REPORTING VIEWS
-- ============================
create or replace view public.vw_personnel_profile as
select
  p.id,
  p.personnel_code,
  p.service_number,
  p.last_name,
  p.first_name,
  p.middle_name,
  p.sex,
  p.birthdate,
  p.rank_id,
  p.company_id,
  p.battalion_id,
  r.code as rank_code,
  r.name as rank_name,
  c.code as company_code,
  c.name as company_name,
  b.code as battalion_code,
  b.name as battalion_name,
  es.name as employment_status,
  ss.name as service_status,
  p.contact_number,
  p.date_enlisted,
  p.created_at,
  p.updated_at
from public.personnel p
join public.ranks r on r.id = p.rank_id
left join public.companies c on c.id = p.company_id
left join public.battalions b on b.id = coalesce(p.battalion_id, c.battalion_id)
join public.employment_statuses es on es.id = p.employment_status_id
join public.service_statuses ss on ss.id = p.service_status_id;

create or replace view public.vw_equipment_accountability as
with latest_issuance as (
  select distinct on (ei.equipment_asset_id)
    ei.equipment_asset_id,
    ei.id as issuance_id,
    ei.issue_no,
    ei.issue_date,
    ei.expected_return_date,
    ei.actual_return_date,
    ist.name as issuance_status,
    p.personnel_code as issued_to_personnel_code,
    p.last_name as issued_to_last_name,
    p.first_name as issued_to_first_name
  from public.equipment_issuances ei
  join public.issuance_statuses ist on ist.id = ei.status_id
  join public.personnel p on p.id = ei.issued_to_personnel_id
  order by ei.equipment_asset_id, ei.issue_date desc, ei.created_at desc
)
select
  ea.id as equipment_asset_id,
  ea.asset_tag,
  ea.serial_no,
  ea.batch_no,
  ei.equipment_code,
  ei.name as item_name,
  ec.code as category_code,
  ec.name as category_name,
  ap.personnel_code as assigned_personnel_code,
  ap.last_name as assigned_personnel_last_name,
  ap.first_name as assigned_personnel_first_name,
  c.code as assigned_company_code,
  c.name as assigned_company_name,
  b.code as assigned_battalion_code,
  b.name as assigned_battalion_name,
  ea.current_location,
  cs.name as condition_status,
  ss.name as serviceability_status,
  ast.name as asset_status,
  li.issuance_id,
  li.issue_no as latest_issue_no,
  li.issue_date as latest_issue_date,
  li.expected_return_date as latest_expected_return_date,
  li.actual_return_date as latest_actual_return_date,
  li.issuance_status as latest_issuance_status,
  li.issued_to_personnel_code,
  li.issued_to_last_name,
  li.issued_to_first_name
from public.equipment_assets ea
join public.equipment_items ei on ei.id = ea.equipment_item_id
join public.equipment_categories ec on ec.id = ei.category_id
left join public.personnel ap on ap.id = ea.assigned_personnel_id
left join public.companies c on c.id = ea.assigned_company_id
left join public.battalions b on b.id = ea.assigned_battalion_id
left join public.condition_statuses cs on cs.id = ea.condition_status_id
left join public.serviceability_statuses ss on ss.id = ea.serviceability_status_id
join public.asset_statuses ast on ast.id = ea.asset_status_id
left join latest_issuance li on li.equipment_asset_id = ea.id;

create or replace view public.vw_equipment_serviceability as
select
  coalesce(ss.name, 'Unknown') as serviceability_status,
  coalesce(cs.name, 'Unknown') as condition_status,
  count(*)::bigint as asset_count
from public.equipment_assets ea
left join public.serviceability_statuses ss on ss.id = ea.serviceability_status_id
left join public.condition_statuses cs on cs.id = ea.condition_status_id
group by coalesce(ss.name, 'Unknown'), coalesce(cs.name, 'Unknown')
order by serviceability_status, condition_status;

create or replace view public.vw_dashboard_kpis as
select
  (select count(*)::bigint from public.personnel) as total_personnel,
  (
    select count(*)::bigint
    from public.personnel p
    join public.service_statuses ss on ss.id = p.service_status_id
    where ss.name = 'Active Duty'
  ) as active_personnel,
  (
    select count(distinct dr.personnel_id)::bigint
    from public.deployment_records dr
    join public.deployment_statuses ds on ds.id = dr.status_id
    where ds.name = 'Active'
  ) as deployed_personnel,
  (select count(*)::bigint from public.equipment_assets) as total_equipment_assets,
  (
    select count(*)::bigint
    from public.equipment_assets ea
    join public.serviceability_statuses ss on ss.id = ea.serviceability_status_id
    where ss.name = 'Serviceable'
  ) as serviceable_equipment_assets,
  (
    select count(*)::bigint
    from public.equipment_issuances ei
    join public.issuance_statuses ist on ist.id = ei.status_id
    where ist.name = 'Issued'
      and ei.actual_return_date is null
  ) as issued_equipment_assets,
  (
    select count(*)::bigint
    from public.equipment_issuances ei
    join public.issuance_statuses ist on ist.id = ei.status_id
    where ist.name in ('Issued', 'Overdue')
      and ei.actual_return_date is null
      and ei.expected_return_date is not null
      and ei.expected_return_date < current_date
  ) as overdue_equipment_returns;
