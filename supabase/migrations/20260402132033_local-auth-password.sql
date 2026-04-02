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


create or replace function public.authenticate_local_user(p_identifier text, p_password text)
returns table (
  user_id uuid,
  username text,
  full_name text
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  return query
  select up.id, up.username, up.full_name
  from public.user_profiles up
  left join auth.users au on au.id = up.id
  where up.is_active = true
    and (
      lower(up.username) = lower(p_identifier)
      or lower(au.email) = lower(p_identifier)
    )
    and up.password_hash is not null
    and up.password_hash = crypt(p_password, up.password_hash)
  limit 1;
end;
$$;
