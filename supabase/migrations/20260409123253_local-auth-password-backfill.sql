update public.user_profiles up
set password_hash = au.encrypted_password,
    password_updated_at = coalesce(up.password_updated_at, now()),
    updated_at = now()
from auth.users au
where au.id = up.id
  and up.password_hash is null
  and au.encrypted_password is not null
  and au.encrypted_password <> '';


