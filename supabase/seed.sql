-- Seed lookup and starter master data

-- Employment statuses
insert into public.employment_statuses (name)
values
  ('Regular'),
  ('Contractual'),
  ('Probationary'),
  ('Separated')
on conflict (name) do nothing;

-- Service statuses
insert into public.service_statuses (name)
values
  ('Active Duty'),
  ('Reserve'),
  ('Detached'),
  ('On Leave'),
  ('Retired')
on conflict (name) do nothing;

-- Levels
insert into public.levels (name)
values
  ('Local'),
  ('National'),
  ('International')
on conflict (name) do nothing;

-- Training statuses
insert into public.training_statuses (name)
values
  ('Planned'),
  ('Ongoing'),
  ('Completed'),
  ('Expired'),
  ('Cancelled')
on conflict (name) do nothing;

-- Deployment statuses
insert into public.deployment_statuses (name)
values
  ('Planned'),
  ('Active'),
  ('Completed'),
  ('Cancelled')
on conflict (name) do nothing;

-- Engagement statuses
insert into public.engagement_statuses (name)
values
  ('Planned'),
  ('Ongoing'),
  ('Completed'),
  ('Cancelled')
on conflict (name) do nothing;

-- Engagement types
insert into public.engagement_types (name)
values
  ('Seminar'),
  ('Conference'),
  ('Joint Exercise'),
  ('Community Operation'),
  ('Official Representation')
on conflict (name) do nothing;

-- Condition statuses
insert into public.condition_statuses (name)
values
  ('Excellent'),
  ('Good'),
  ('Fair'),
  ('Damaged')
on conflict (name) do nothing;

-- Serviceability statuses
insert into public.serviceability_statuses (name)
values
  ('Serviceable'),
  ('Limited Serviceability'),
  ('Unserviceable')
on conflict (name) do nothing;

-- Asset statuses
insert into public.asset_statuses (name)
values
  ('In Stock'),
  ('Issued'),
  ('Lost'),
  ('Under Repair'),
  ('Condemned')
on conflict (name) do nothing;

-- Issuance statuses
insert into public.issuance_statuses (name)
values
  ('Issued'),
  ('Returned'),
  ('Overdue')
on conflict (name) do nothing;

-- Maintenance types
insert into public.maintenance_types (name)
values
  ('Preventive'),
  ('Corrective'),
  ('Inspection'),
  ('Calibration')
on conflict (name) do nothing;

-- Incident types
insert into public.incident_types (code, name)
values
  ('LOST', 'Lost'),
  ('DAMAGED', 'Damaged'),
  ('MISUSE', 'Misuse'),
  ('THEFT', 'Theft'),
  ('OP_FAIL', 'Operational Failure')
on conflict (code) do nothing;

-- Investigation statuses
insert into public.investigation_statuses (name)
values
  ('Reported'),
  ('Under Investigation'),
  ('Resolved'),
  ('Closed')
on conflict (name) do nothing;

-- Starter ranks
insert into public.ranks (code, name, sort_order)
values
  ('PVT', 'Private', 1),
  ('CPL', 'Corporal', 2),
  ('SGT', 'Sergeant', 3),
  ('LT', 'Lieutenant', 4),
  ('CPT', 'Captain', 5)
on conflict (code) do update
set name = excluded.name,
    sort_order = excluded.sort_order;

-- Starter battalions
insert into public.battalions (code, name, is_active)
values
  ('1BN', '1st Battalion', true),
  ('2BN', '2nd Battalion', true)
on conflict (code) do update
set name = excluded.name,
    is_active = excluded.is_active;

-- Starter companies (scoped under battalions)
insert into public.companies (battalion_id, code, name, is_active)
select b.id, 'ALPHA', 'Alpha Company', true
from public.battalions b
where b.code = '1BN'
on conflict (code) do update
set battalion_id = excluded.battalion_id,
    name = excluded.name,
    is_active = excluded.is_active;

insert into public.companies (battalion_id, code, name, is_active)
select b.id, 'BRAVO', 'Bravo Company', true
from public.battalions b
where b.code = '2BN'
on conflict (code) do update
set battalion_id = excluded.battalion_id,
    name = excluded.name,
    is_active = excluded.is_active;

-- Account types (RBAC roles)
insert into public.account_types (code, name, description, is_system)
values
  ('ADMIN', 'ADMIN', 'System administrator with full access.', true),
  ('COMMANDER', 'COMMANDER', 'Command-level user with strategic controls.', true),
  ('OPERATIONS', 'OPERATIONS', 'Operations-focused planning and execution role.', true),
  ('TRAINING_OFFICER', 'TRAINING_OFFICER', 'Role responsible for training readiness records.', true),
  ('LOGISTICS', 'LOGISTICS', 'Role responsible for inventory and issuance workflows.', true),
  ('MEDICAL', 'MEDICAL', 'Role responsible for medical-readiness workflows.', true),
  ('AUDITOR', 'AUDITOR', 'Read-only role with expanded audit visibility.', true),
  ('VIEWER', 'VIEWER', 'Basic read-only access role.', true)
on conflict (code) do update
set name = excluded.name,
    description = excluded.description,
    is_system = excluded.is_system,
    updated_at = now();

-- Permissions
insert into public.permissions (code, name, module)
values
  ('personnel.view', 'View Personnel', 'personnel'),
  ('personnel.create', 'Create Personnel', 'personnel'),
  ('personnel.update', 'Update Personnel', 'personnel'),
  ('personnel.delete', 'Delete Personnel', 'personnel'),
  ('training.view', 'View Training Records', 'training'),
  ('training.manage', 'Manage Training', 'training'),
  ('deployment.view', 'View Deployment Records', 'deployment'),
  ('deployment.manage', 'Manage Deployment', 'deployment'),
  ('engagement.view', 'View Engagement Records', 'engagement'),
  ('engagement.manage', 'Manage Engagement', 'engagement'),
  ('battalion.view', 'View Battalion', 'unit_management'),
  ('company.view', 'View Company', 'unit_management'),
  ('equipment.view', 'View Equipment', 'equipment'),
  ('equipment.manage', 'Manage Equipment', 'equipment'),
  ('equipment.issue', 'Issue Equipment', 'equipment'),
  ('equipment.maintain', 'Maintain Equipment', 'equipment'),
  ('reports.view', 'View Reports', 'reports'),
  ('audit.view', 'View Audit Logs', 'audit'),
  ('user.view', 'View User', 'user_management'),
  ('user.create', 'Create User', 'user_management'),
  ('user.update', 'Update User', 'user_management'),
  ('user.delete', 'Delete User', 'user_management'),
  ('account_type.view', 'View Account Type', 'account_type_management'),
  ('account_type.create', 'Create Account Type', 'account_type_management'),
  ('account_type.update', 'Update Account Type', 'account_type_management'),
on conflict (code) do update
set name = excluded.name,
    module = excluded.module;

-- Grant ADMIN account type all available permissions.
insert into public.account_type_permissions (account_type_id, permission_id)
select at.id, p.id
from public.account_types at
cross join public.permissions p
where at.code = 'ADMIN'
on conflict (account_type_id, permission_id) do nothing;

-- Optional bootstrap account seeding.
-- Configure DB settings before seed execution:
--   app.seed_default_user ('true'/'false', default false)
--   app.default_user_email
--   app.default_user_password
--   app.default_user_full_name (optional)
do $$
declare
  v_seed_default_user text := coalesce(nullif(current_setting('app.seed_default_user', true), ''), 'false');
  v_email text := nullif(current_setting('app.default_user_email', true), '');
  v_password text := nullif(current_setting('app.default_user_password', true), '');
  v_full_name text := coalesce(nullif(current_setting('app.default_user_full_name', true), ''), 'Default Administrator');
  v_user_id uuid;
begin
  if lower(v_seed_default_user) <> 'true' then
    raise notice 'Skipping default user seed. Set app.seed_default_user=true to enable.';
    return;
  end if;

  if v_email is null or v_password is null then
    raise exception using
      message = 'Default user seeding enabled but missing credentials.',
      hint = 'Set app.default_user_email and app.default_user_password before running seed.sql.';
  end if;

  select id into v_user_id
  from auth.users
  where email = v_email
  limit 1;

  if v_user_id is null then
    insert into auth.users (
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    values (
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      v_email,
      extensions.crypt(v_password, extensions.gen_salt('bf')),
      now(),
      jsonb_build_object('provider', 'email', 'providers', array['email']),
      '{}'::jsonb,
      now(),
      now()
    )
    returning id into v_user_id;

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      created_at,
      updated_at
    )
    values (
      gen_random_uuid(),
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email',
      v_user_id::text,
      now(),
      now()
    )
    on conflict do nothing;
  end if;

  insert into public.user_profiles (id, email, full_name, is_active, password_hash, password_updated_at)
 values (
    v_user_id,
    v_email,
    v_full_name,
    true,
    extensions.crypt(v_password, extensions.gen_salt('bf')),
    now()
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      is_active = true,
      password_hash = excluded.password_hash,
      password_updated_at = now(),
      updated_at = now();

  insert into public.user_account_types (user_id, account_type_id)
  select v_user_id, at.id
  from public.account_types at
  where at.code = 'ADMIN'
  on conflict (user_id, account_type_id) do nothing;
end;
$$;
