-- Add local credential support for RBAC auth and helper functions for login verification.
alter table if exists public.user_profiles
  add column if not exists password_hash text null,
  add column if not exists password_updated_at timestamptz null;

comment on column public.user_profiles.password_hash is
  'bcrypt hash for application-managed authentication. Never store plaintext passwords.';


create or replace function public.set_user_profile_password(p_user_id uuid, p_password text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_password is null or length(trim(p_password)) < 8 then
    raise exception 'Password must be at least 8 characters.';
  end if;

  update public.user_profiles
  set password_hash = crypt(p_password, gen_salt('bf')),
      password_updated_at = now(),
      updated_at = now()
  where id = p_user_id;

  if not found then
    raise exception 'User profile % not found.', p_user_id;
  end if;
end;
$$;
