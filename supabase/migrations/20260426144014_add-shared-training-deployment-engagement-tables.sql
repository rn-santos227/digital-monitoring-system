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
