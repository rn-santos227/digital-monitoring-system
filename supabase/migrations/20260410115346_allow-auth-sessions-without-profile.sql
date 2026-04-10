alter table if exists public.auth_sessions
  drop constraint if exists auth_sessions_user_id_fkey;

alter table if exists public.auth_sessions
  add constraint auth_sessions_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;

create or replace function public.authenticate_local_user(p_email text, p_password text)
returns table (
  user_id uuid,
  email text,
  full_name text
)
language plpgsql
security definer
set search_path = public, auth, extensions
as $$
begin
  return query
  select
    au.id,
    au.email::text,
    coalesce(up.full_name, au.raw_user_meta_data ->> 'full_name')::text as full_name
  from auth.users au
  left join public.user_profiles up on up.id = au.id
  where au.email is not null
    and lower(trim(au.email)) = lower(trim(p_email))
    and coalesce(up.is_active, true) = true
    and coalesce(up.password_hash, au.encrypted_password) is not null
    and coalesce(up.password_hash, au.encrypted_password) = extensions.crypt(
      p_password,
      coalesce(up.password_hash, au.encrypted_password)
    )
  limit 1;
end;
$$;
