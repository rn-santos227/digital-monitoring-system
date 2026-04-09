update public.user_profiles up
set password_hash = au.encrypted_password,
    password_updated_at = coalesce(up.password_updated_at, now()),
    updated_at = now()
from auth.users au
where au.id = up.id
  and up.password_hash is null
  and au.encrypted_password is not null
  and au.encrypted_password <> '';

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
  select up.id, up.email, up.full_name
  from public.user_profiles up
  join auth.users au on au.id = up.id
  where up.is_active = true
    and lower(up.email) = lower(p_email)
    and coalesce(up.password_hash, au.encrypted_password) is not null
    and coalesce(up.password_hash, au.encrypted_password) = extensions.crypt(
      p_password,
      coalesce(up.password_hash, au.encrypted_password)
    )
  limit 1;
end;
$$;
