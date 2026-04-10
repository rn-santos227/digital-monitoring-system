alter table if exists public.auth_sessions
  drop constraint if exists auth_sessions_user_id_fkey;

alter table if exists public.auth_sessions
  add constraint auth_sessions_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;
