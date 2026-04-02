-- Add local credential support for RBAC auth and helper functions for login verification.
alter table if exists public.user_profiles
  add column if not exists password_hash text null,
  add column if not exists password_updated_at timestamptz null;

comment on column public.user_profiles.password_hash is
  'bcrypt hash for application-managed authentication. Never store plaintext passwords.';
