revoke all on table public.auth_sessions from anon;
grant select, insert, update, delete on table public.auth_sessions to authenticated;

alter table public.auth_sessions enable row level security;

drop policy if exists authenticated_session_access_policy on public.auth_sessions;
drop policy if exists authenticated_select_policy on public.auth_sessions;
drop policy if exists authenticated_insert_policy on public.auth_sessions;
drop policy if exists authenticated_update_policy on public.auth_sessions;
drop policy if exists authenticated_delete_policy on public.auth_sessions;

create policy authenticated_select_policy
on public.auth_sessions
for select
to authenticated
using (auth.uid() = user_id);
