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
