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

create or replace function public.has_table_privilege(p_table_name text, p_action text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_permission_codes text[];
begin
  if v_uid is null then
    return false;
  end if;

  v_permission_codes := case
    -- personnel domain
    when p_table_name = 'personnel' and p_action = 'select' then array['personnel.view']
    when p_table_name = 'personnel' and p_action = 'insert' then array['personnel.create']
    when p_table_name = 'personnel' and p_action = 'update' then array['personnel.update']
    when p_table_name = 'personnel' and p_action = 'delete' then array['personnel.delete']

    -- training/deployment/engagement domains
    when p_table_name = 'training_records' and p_action in ('select','insert','update','delete') then array['training.manage']
    when p_table_name = 'deployment_records' and p_action in ('select','insert','update','delete') then array['deployment.manage']
    when p_table_name = 'engagement_records' and p_action in ('select','insert','update','delete') then array['engagement.manage']

    -- equipment domain
    when p_table_name in ('equipment_categories', 'equipment_items', 'equipment_assets') and p_action = 'select' then array['equipment.view']
    when p_table_name in ('equipment_categories', 'equipment_items', 'equipment_assets') and p_action in ('insert','update','delete') then array['equipment.manage']
    when p_table_name = 'equipment_issuances' and p_action = 'select' then array['equipment.view']
    when p_table_name = 'equipment_issuances' and p_action in ('insert','update','delete') then array['equipment.issue', 'equipment.manage']
    when p_table_name = 'equipment_maintenance_records' and p_action = 'select' then array['equipment.view']
    when p_table_name = 'equipment_maintenance_records' and p_action in ('insert','update','delete') then array['equipment.maintain', 'equipment.manage']
    when p_table_name = 'equipment_incidents' and p_action = 'select' then array['equipment.view']
    when p_table_name = 'equipment_incidents' and p_action in ('insert','update','delete') then array['equipment.maintain', 'equipment.manage']

    -- audit/reporting
    when p_table_name = 'audit_logs' and p_action = 'select' then array['audit.view']

    -- RBAC administration tables (admin-only via has_rbac_permission ADMIN shortcut)
    when p_table_name in ('user_profiles', 'account_types', 'permissions', 'user_account_types', 'account_type_permissions')
      and p_action in ('select','insert','update','delete') then array['__admin_only__']

    -- default-deny for unmapped tables/actions
    else null
  end;

  if v_permission_codes is null then
    return false;
  end if;

  return exists (
    select 1
    from unnest(v_permission_codes) as pc(code)
    where public.has_rbac_permission(v_uid, pc.code)
  );
end;
