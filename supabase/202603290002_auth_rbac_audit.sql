create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  personnel_id uuid null references public.personnel (id),
  username text not null unique,
  full_name text not null,
  avatar_url text null,
  is_active boolean not null default true,
  last_login_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.auth_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  access_token text not null,
  refresh_token text null,
  provider text not null,
  ip_address text null,
  user_agent text null,
  expires_at timestamptz not null,
  revoked_at timestamptz null,
  created_at timestamptz not null default now()
);


create index if not exists auth_sessions_user_id_idx on public.auth_sessions (user_id);
create index if not exists auth_sessions_expires_at_idx on public.auth_sessions (expires_at);
create index if not exists auth_sessions_revoked_at_idx on public.auth_sessions (revoked_at);

comment on table public.auth_sessions is
  'OAuth/session token metadata from Supabase Auth. Prefer encrypted or hashed token persistence at rest where possible.';
comment on column public.auth_sessions.access_token is
  'Token currently stored as plaintext for revocation lookup. TODO: store hashed token + encrypted original if product constraints allow.';

create table if not exists public.account_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  description text null,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_account_types (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles (id) on delete cascade,
  account_type_id uuid not null references public.account_types (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  assigned_by uuid null references public.user_profiles (id) on delete set null,
  unique (user_id, account_type_id)
);

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  module text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.account_type_permissions (
  id uuid primary key default gen_random_uuid(),
  account_type_id uuid not null references public.account_types (id) on delete cascade,
  permission_id uuid not null references public.permissions (id) on delete cascade,
  unique (account_type_id, permission_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references public.user_profiles (id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid null,
  old_data jsonb null,
  new_data jsonb null,
  metadata jsonb null,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_user_id_idx on public.audit_logs (user_id);
create index if not exists audit_logs_table_name_idx on public.audit_logs (table_name);
create index if not exists audit_logs_created_at_desc_idx on public.audit_logs (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


create or replace function public.log_audit_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
  current_record_id uuid;
begin
  -- TODO: inject user_id from application layer if not available in DB session
  begin
    actor_id := nullif(current_setting('app.audit_user_id', true), '')::uuid;
  exception
    when others then
      actor_id := null;
  end;

  if tg_op = 'INSERT' then
    current_record_id := (to_jsonb(new)->>'id')::uuid;

    insert into public.audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    values (actor_id, 'INSERT', tg_table_name, current_record_id, null, to_jsonb(new));

    return new;
  elsif tg_op = 'UPDATE' then
    current_record_id := coalesce((to_jsonb(new)->>'id')::uuid, (to_jsonb(old)->>'id')::uuid);

    insert into public.audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    values (actor_id, 'UPDATE', tg_table_name, current_record_id, to_jsonb(old), to_jsonb(new));

    return new;
  elsif tg_op = 'DELETE' then
    current_record_id := (to_jsonb(old)->>'id')::uuid;

    insert into public.audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    values (actor_id, 'DELETE', tg_table_name, current_record_id, to_jsonb(old), null);

    return old;
  end if;

  return null;
end;
$$;

create or replace function public.set_audit_user(audit_user_id uuid)
returns void
language sql
security definer
as $$
  select set_config('app.audit_user_id', coalesce(audit_user_id::text, ''), true);
$$;


-- Ensure baseline audit fields exist in major operational tables.
alter table if exists public.personnel
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists created_by uuid null references public.user_profiles (id) on delete set null;

alter table if exists public.training_records
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists created_by uuid null references public.user_profiles (id) on delete set null;

alter table if exists public.deployment_records
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists created_by uuid null references public.user_profiles (id) on delete set null;

alter table if exists public.engagement_records
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists created_by uuid null references public.user_profiles (id) on delete set null;

alter table if exists public.equipment_assets
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists created_by uuid null references public.user_profiles (id) on delete set null;

alter table if exists public.equipment_issuances
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists created_by uuid null references public.user_profiles (id) on delete set null;

drop trigger if exists set_user_profiles_updated_at on public.user_profiles;

create trigger set_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_account_types_updated_at on public.account_types;

create trigger set_account_types_updated_at
before update on public.account_types
for each row
execute function public.set_updated_at();
