grant usage on schema public to authenticated;

create or replace function public.has_rbac_permission(p_user_id uuid, p_permission_code text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_account_types uat
    join public.account_types at on at.id = uat.account_type_id
    where uat.user_id = p_user_id
      and at.code = 'ADMIN'
  )
  or exists (
    select 1
    from public.user_account_types uat
    join public.account_type_permissions atp on atp.account_type_id = uat.account_type_id
    join public.permissions p on p.id = atp.permission_id
    where uat.user_id = p_user_id
      and p.code = p_permission_code
  );
$$;
