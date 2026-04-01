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

