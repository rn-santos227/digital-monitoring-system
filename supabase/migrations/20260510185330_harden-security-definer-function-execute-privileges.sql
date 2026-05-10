revoke execute on function public.authenticate_local_user(text, text) from public, anon, authenticated;
revoke execute on function public.has_rbac_permission(uuid, text) from public, anon, authenticated;
revoke execute on function public.has_table_privilege(text, text) from public, anon, authenticated;
revoke execute on function public.log_audit_changes() from public, anon, authenticated;
revoke execute on function public.set_audit_user(uuid) from public, anon, authenticated;
revoke execute on function public.set_user_profile_password(uuid, text) from public, anon, authenticated;

grant execute on function public.authenticate_local_user(text, text) to service_role;
grant execute on function public.has_rbac_permission(uuid, text) to service_role;
grant execute on function public.has_table_privilege(text, text) to service_role;
grant execute on function public.log_audit_changes() to service_role;
grant execute on function public.set_audit_user(uuid) to service_role;
grant execute on function public.set_user_profile_password(uuid, text) to service_role;
