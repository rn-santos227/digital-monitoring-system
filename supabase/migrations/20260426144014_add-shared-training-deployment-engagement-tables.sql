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

