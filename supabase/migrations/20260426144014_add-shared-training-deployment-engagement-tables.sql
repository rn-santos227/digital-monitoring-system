create table if not exists public.trainings (
  id uuid primary key default gen_random_uuid(),
  training_title text not null,
  training_category_id uuid null references public.training_categories(id) on delete restrict,
  level_id uuid null references public.levels(id) on delete restrict,
  start_date date null,
  end_date date null,
  status_id uuid not null references public.training_statuses(id) on delete restrict,
  default_remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references public.user_profiles(id) on delete set null,
  constraint trainings_date_check check (end_date is null or start_date is null or end_date >= start_date)
);

create table if not exists public.deployments (
  id uuid primary key default gen_random_uuid(),
  deployment_area text not null,
  deployment_area_latitude numeric(9,6) null,
  deployment_area_longitude numeric(9,6) null,
  assignment_role text null,
  operation_name text null,
  start_date date not null,
  end_date date null,
  status_id uuid not null references public.deployment_statuses(id) on delete restrict,
  location text null,
  supervisor_id uuid null references public.personnel(id) on delete restrict,
  default_remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references public.user_profiles(id) on delete set null,
  constraint deployments_date_check check (end_date is null or end_date >= start_date),
  constraint deployments_area_latitude_check check (
    deployment_area_latitude is null or (deployment_area_latitude >= -90 and deployment_area_latitude <= 90)
  ),
  constraint deployments_area_longitude_check check (
    deployment_area_longitude is null or (deployment_area_longitude >= -180 and deployment_area_longitude <= 180)
  )
);

create table if not exists public.engagements (
  id uuid primary key default gen_random_uuid(),
  engagement_title text not null,
  engagement_type_id uuid not null references public.engagement_types(id) on delete restrict,
  level_id uuid null references public.levels(id) on delete restrict,
  date_start date null,
  date_end date null,
  status_id uuid not null references public.engagement_statuses(id) on delete restrict,
  default_remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references public.user_profiles(id) on delete set null,
  constraint engagements_date_check check (date_end is null or date_start is null or date_end >= date_start)
);

alter table if exists public.training_records
  add column if not exists training_id uuid null references public.trainings(id) on delete set null;

alter table if exists public.deployment_records
  add column if not exists deployment_id uuid null references public.deployments(id) on delete set null;

alter table if exists public.engagement_records
  add column if not exists engagement_id uuid null references public.engagements(id) on delete set null;

create index if not exists idx_training_records_training_id on public.training_records(training_id);
create index if not exists idx_deployment_records_deployment_id on public.deployment_records(deployment_id);
create index if not exists idx_engagement_records_engagement_id on public.engagement_records(engagement_id);

create index if not exists idx_trainings_training_category_id on public.trainings(training_category_id);
create index if not exists idx_trainings_level_id on public.trainings(level_id);
create index if not exists idx_trainings_status_id on public.trainings(status_id);

create index if not exists idx_deployments_status_id on public.deployments(status_id);
create index if not exists idx_deployments_supervisor_id on public.deployments(supervisor_id);
create index if not exists idx_deployments_start_date on public.deployments(start_date);

create index if not exists idx_engagements_engagement_type_id on public.engagements(engagement_type_id);
create index if not exists idx_engagements_level_id on public.engagements(level_id);
create index if not exists idx_engagements_status_id on public.engagements(status_id);

-- Backfill shared tables from existing records.
insert into public.trainings (
  training_title,
  training_category_id,
  level_id,
  start_date,
  end_date,
  status_id,
  default_remarks
)
select distinct
  tr.training_title,
  tr.training_category_id,
  tr.level_id,
  tr.start_date,
  tr.end_date,
  tr.status_id,
  tr.remarks
from public.training_records tr
where not exists (
  select 1
  from public.trainings t
  where t.training_title = tr.training_title
    and t.training_category_id is not distinct from tr.training_category_id
    and t.level_id is not distinct from tr.level_id
    and t.start_date is not distinct from tr.start_date
    and t.end_date is not distinct from tr.end_date
    and t.status_id = tr.status_id
    and t.default_remarks is not distinct from tr.remarks
);

update public.training_records tr
set training_id = t.id
from public.trainings t
where tr.training_id is null
  and t.training_title = tr.training_title
  and t.training_category_id is not distinct from tr.training_category_id
  and t.level_id is not distinct from tr.level_id
  and t.start_date is not distinct from tr.start_date
  and t.end_date is not distinct from tr.end_date
  and t.status_id = tr.status_id
  and t.default_remarks is not distinct from tr.remarks;

insert into public.deployments (
  deployment_area,
  deployment_area_latitude,
  deployment_area_longitude,
  assignment_role,
  operation_name,
  start_date,
  end_date,
  status_id,
  location,
  supervisor_id,
  default_remarks
)
select distinct
  dr.deployment_area,
  dr.deployment_area_latitude,
  dr.deployment_area_longitude,
  dr.assignment_role,
  dr.operation_name,
  dr.start_date,
  dr.end_date,
  dr.status_id,
  dr.location,
  dr.supervisor_id,
  dr.remarks
from public.deployment_records dr
where not exists (
  select 1
  from public.deployments d
  where d.deployment_area = dr.deployment_area
    and d.deployment_area_latitude is not distinct from dr.deployment_area_latitude
    and d.deployment_area_longitude is not distinct from dr.deployment_area_longitude
    and d.assignment_role is not distinct from dr.assignment_role
    and d.operation_name is not distinct from dr.operation_name
    and d.start_date = dr.start_date
    and d.end_date is not distinct from dr.end_date
    and d.status_id = dr.status_id
    and d.location is not distinct from dr.location
    and d.supervisor_id is not distinct from dr.supervisor_id
    and d.default_remarks is not distinct from dr.remarks
);

update public.deployment_records dr
set deployment_id = d.id
from public.deployments d
where dr.deployment_id is null
  and d.deployment_area = dr.deployment_area
  and d.deployment_area_latitude is not distinct from dr.deployment_area_latitude
  and d.deployment_area_longitude is not distinct from dr.deployment_area_longitude
  and d.assignment_role is not distinct from dr.assignment_role
  and d.operation_name is not distinct from dr.operation_name
  and d.start_date = dr.start_date
  and d.end_date is not distinct from dr.end_date
  and d.status_id = dr.status_id
  and d.location is not distinct from dr.location
  and d.supervisor_id is not distinct from dr.supervisor_id
  and d.default_remarks is not distinct from dr.remarks;

insert into public.engagements (
  engagement_title,
  engagement_type_id,
  level_id,
  date_start,
  date_end,
  status_id,
  default_remarks
)
select distinct
  er.engagement_title,
  er.engagement_type_id,
  er.level_id,
  er.date_start,
  er.date_end,
  er.status_id,
  er.remarks
from public.engagement_records er
where not exists (
  select 1
  from public.engagements e
  where e.engagement_title = er.engagement_title
    and e.engagement_type_id = er.engagement_type_id
    and e.level_id is not distinct from er.level_id
    and e.date_start is not distinct from er.date_start
    and e.date_end is not distinct from er.date_end
    and e.status_id = er.status_id
    and e.default_remarks is not distinct from er.remarks
);

update public.engagement_records er
set engagement_id = e.id
from public.engagements e
where er.engagement_id is null
  and e.engagement_title = er.engagement_title
  and e.engagement_type_id = er.engagement_type_id
  and e.level_id is not distinct from er.level_id
  and e.date_start is not distinct from er.date_start
  and e.date_end is not distinct from er.date_end
  and e.status_id = er.status_id
  and e.default_remarks is not distinct from er.remarks;
