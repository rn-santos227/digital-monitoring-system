create table if not exists public.trainings (
  id uuid primary key default gen_random_uuid(),
  training_title text not null,
  training_category_id uuid null references public.training_categories(id) on delete restrict,
  level_id uuid null references public.levels(id) on delete restrict,
  start_date date null,
  end_date date null,
  status_id uuid not null references public.training_statuses(id) on delete restrict,
  default_remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references public.user_profiles(id) on delete set null,
  constraint trainings_date_check check (end_date is null or start_date is null or end_date >= start_date)
);

create table if not exists public.deployments (
  id uuid primary key default gen_random_uuid(),
  deployment_area text not null,
  deployment_area_latitude numeric(9,6) null,
  deployment_area_longitude numeric(9,6) null,
  assignment_role text null,
  operation_name text null,
  start_date date not null,
  end_date date null,
  status_id uuid not null references public.deployment_statuses(id) on delete restrict,
  location text null,
  supervisor_id uuid null references public.personnel(id) on delete restrict,
  default_remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references public.user_profiles(id) on delete set null,
  constraint deployments_date_check check (end_date is null or end_date >= start_date),
  constraint deployments_area_latitude_check check (
    deployment_area_latitude is null or (deployment_area_latitude >= -90 and deployment_area_latitude <= 90)
  ),
  constraint deployments_area_longitude_check check (
    deployment_area_longitude is null or (deployment_area_longitude >= -180 and deployment_area_longitude <= 180)
  )
);

create table if not exists public.engagements (
  id uuid primary key default gen_random_uuid(),
  engagement_title text not null,
  engagement_type_id uuid not null references public.engagement_types(id) on delete restrict,
  level_id uuid null references public.levels(id) on delete restrict,
  date_start date null,
  date_end date null,
  status_id uuid not null references public.engagement_statuses(id) on delete restrict,
  default_remarks text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references public.user_profiles(id) on delete set null,
  constraint engagements_date_check check (date_end is null or date_start is null or date_end >= date_start)
);

alter table if exists public.training_records
  add column if not exists training_id uuid null references public.trainings(id) on delete set null;

alter table if exists public.deployment_records
  add column if not exists deployment_id uuid null references public.deployments(id) on delete set null;

alter table if exists public.engagement_records
  add column if not exists engagement_id uuid null references public.engagements(id) on delete set null;

create index if not exists idx_training_records_training_id on public.training_records(training_id);
create index if not exists idx_deployment_records_deployment_id on public.deployment_records(deployment_id);
create index if not exists idx_engagement_records_engagement_id on public.engagement_records(engagement_id);

create index if not exists idx_trainings_training_category_id on public.trainings(training_category_id);
create index if not exists idx_trainings_level_id on public.trainings(level_id);
create index if not exists idx_trainings_status_id on public.trainings(status_id);

create index if not exists idx_deployments_status_id on public.deployments(status_id);
create index if not exists idx_deployments_supervisor_id on public.deployments(supervisor_id);
create index if not exists idx_deployments_start_date on public.deployments(start_date);

create index if not exists idx_engagements_engagement_type_id on public.engagements(engagement_type_id);
create index if not exists idx_engagements_level_id on public.engagements(level_id);
create index if not exists idx_engagements_status_id on public.engagements(status_id);

-- Backfill shared tables from existing records.
insert into public.trainings (
  training_title,
  training_category_id,
  level_id,
  start_date,
  end_date,
  status_id,
  default_remarks
)
select distinct
  tr.training_title,
  tr.training_category_id,
  tr.level_id,
  tr.start_date,
  tr.end_date,
  tr.status_id,
  tr.remarks
from public.training_records tr
where not exists (
  select 1
  from public.trainings t
  where t.training_title = tr.training_title
    and t.training_category_id is not distinct from tr.training_category_id
    and t.level_id is not distinct from tr.level_id
    and t.start_date is not distinct from tr.start_date
    and t.end_date is not distinct from tr.end_date
    and t.status_id = tr.status_id
    and t.default_remarks is not distinct from tr.remarks
);

update public.training_records tr
set training_id = t.id
from public.trainings t
where tr.training_id is null
  and t.training_title = tr.training_title
  and t.training_category_id is not distinct from tr.training_category_id
  and t.level_id is not distinct from tr.level_id
  and t.start_date is not distinct from tr.start_date
  and t.end_date is not distinct from tr.end_date
  and t.status_id = tr.status_id
  and t.default_remarks is not distinct from tr.remarks;

insert into public.deployments (
  deployment_area,
  deployment_area_latitude,
  deployment_area_longitude,
  assignment_role,
  operation_name,
  start_date,
  end_date,
  status_id,
  location,
  supervisor_id,
  default_remarks
)
select distinct
  dr.deployment_area,
  dr.deployment_area_latitude,
  dr.deployment_area_longitude,
  dr.assignment_role,
  dr.operation_name,
  dr.start_date,
  dr.end_date,
  dr.status_id,
  dr.location,
  dr.supervisor_id,
  dr.remarks
from public.deployment_records dr
where not exists (
  select 1
  from public.deployments d
  where d.deployment_area = dr.deployment_area
    and d.deployment_area_latitude is not distinct from dr.deployment_area_latitude
    and d.deployment_area_longitude is not distinct from dr.deployment_area_longitude
    and d.assignment_role is not distinct from dr.assignment_role
    and d.operation_name is not distinct from dr.operation_name
    and d.start_date = dr.start_date
    and d.end_date is not distinct from dr.end_date
    and d.status_id = dr.status_id
    and d.location is not distinct from dr.location
    and d.supervisor_id is not distinct from dr.supervisor_id
    and d.default_remarks is not distinct from dr.remarks
);

update public.deployment_records dr
set deployment_id = d.id
from public.deployments d
where dr.deployment_id is null
  and d.deployment_area = dr.deployment_area
  and d.deployment_area_latitude is not distinct from dr.deployment_area_latitude
  and d.deployment_area_longitude is not distinct from dr.deployment_area_longitude
  and d.assignment_role is not distinct from dr.assignment_role
  and d.operation_name is not distinct from dr.operation_name
  and d.start_date = dr.start_date
  and d.end_date is not distinct from dr.end_date
  and d.status_id = dr.status_id
  and d.location is not distinct from dr.location
  and d.supervisor_id is not distinct from dr.supervisor_id
  and d.default_remarks is not distinct from dr.remarks;

insert into public.engagements (
  engagement_title,
  engagement_type_id,
  level_id,
  date_start,
  date_end,
  status_id,
  default_remarks
)
select distinct
  er.engagement_title,
  er.engagement_type_id,
  er.level_id,
  er.date_start,
  er.date_end,
  er.status_id,
  er.remarks
from public.engagement_records er
where not exists (
  select 1
  from public.engagements e
  where e.engagement_title = er.engagement_title
    and e.engagement_type_id = er.engagement_type_id
    and e.level_id is not distinct from er.level_id
    and e.date_start is not distinct from er.date_start
    and e.date_end is not distinct from er.date_end
    and e.status_id = er.status_id
    and e.default_remarks is not distinct from er.remarks
);

update public.engagement_records er
set engagement_id = e.id
from public.engagements e
where er.engagement_id is null
  and e.engagement_title = er.engagement_title
  and e.engagement_type_id = er.engagement_type_id
  and e.level_id is not distinct from er.level_id
  and e.date_start is not distinct from er.date_start
  and e.date_end is not distinct from er.date_end
  and e.status_id = er.status_id
  and e.default_remarks is not distinct from er.remarks;

rant select, insert, update, delete on table public.trainings to service_role;
grant select, insert, update, delete on table public.deployments to service_role;
grant select, insert, update, delete on table public.engagements to service_role;

grant select, insert, update, delete on table public.trainings to authenticated;
grant select, insert, update, delete on table public.deployments to authenticated;
grant select, insert, update, delete on table public.engagements to authenticated;

alter table public.trainings enable row level security;
alter table public.deployments enable row level security;
alter table public.engagements enable row level security;

alter table public.trainings force row level security;
alter table public.deployments force row level security;
alter table public.engagements force row level security;

drop policy if exists service_role_full_access on public.trainings;
create policy service_role_full_access on public.trainings for all to service_role using (true) with check (true);

drop policy if exists service_role_full_access on public.deployments;
create policy service_role_full_access on public.deployments for all to service_role using (true) with check (true);

drop policy if exists service_role_full_access on public.engagements;
create policy service_role_full_access on public.engagements for all to service_role using (true) with check (true);

drop policy if exists authenticated_select_policy on public.trainings;
create policy authenticated_select_policy
on public.trainings
for select
to authenticated
using (public.has_table_privilege('trainings', 'select'));

drop policy if exists authenticated_insert_policy on public.trainings;
create policy authenticated_insert_policy
on public.trainings
for insert
to authenticated
with check (public.has_table_privilege('trainings', 'insert'));

drop policy if exists authenticated_update_policy on public.trainings;
create policy authenticated_update_policy
on public.trainings
for update
to authenticated
using (public.has_table_privilege('trainings', 'update'))
with check (public.has_table_privilege('trainings', 'update'));

drop policy if exists authenticated_delete_policy on public.trainings;
create policy authenticated_delete_policy
on public.trainings
for delete
to authenticated
using (public.has_table_privilege('trainings', 'delete'));

drop policy if exists authenticated_select_policy on public.deployments;
create policy authenticated_select_policy
on public.deployments
for select
to authenticated
using (public.has_table_privilege('deployments', 'select'));

drop policy if exists authenticated_insert_policy on public.deployments;
create policy authenticated_insert_policy
on public.deployments
for insert
to authenticated
with check (public.has_table_privilege('deployments', 'insert'));

drop policy if exists authenticated_update_policy on public.deployments;
create policy authenticated_update_policy
on public.deployments
for update
to authenticated
using (public.has_table_privilege('deployments', 'update'))
with check (public.has_table_privilege('deployments', 'update'));

drop policy if exists authenticated_delete_policy on public.deployments;
create policy authenticated_delete_policy
on public.deployments
for delete
to authenticated
using (public.has_table_privilege('deployments', 'delete'));

drop policy if exists authenticated_select_policy on public.engagements;
create policy authenticated_select_policy
on public.engagements
for select
to authenticated
using (public.has_table_privilege('engagements', 'select'));

drop policy if exists authenticated_insert_policy on public.engagements;
create policy authenticated_insert_policy
on public.engagements
for insert
to authenticated
with check (public.has_table_privilege('engagements', 'insert'));

drop policy if exists authenticated_update_policy on public.engagements;
create policy authenticated_update_policy
on public.engagements
for update
to authenticated
using (public.has_table_privilege('engagements', 'update'))
with check (public.has_table_privilege('engagements', 'update'));

drop policy if exists authenticated_delete_policy on public.engagements;
create policy authenticated_delete_policy
on public.engagements
for delete
to authenticated
using (public.has_table_privilege('engagements', 'delete'));

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
    when p_table_name in ('trainings', 'training_records') and p_action in ('select','insert','update','delete') then array['training.manage']
    when p_table_name in ('deployments', 'deployment_records') and p_action in ('select','insert','update','delete') then array['deployment.manage']
    when p_table_name in ('engagements', 'engagement_records') and p_action in ('select','insert','update','delete') then array['engagement.manage']

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
$$;

drop trigger if exists set_trainings_updated_at on public.trainings;
create trigger set_trainings_updated_at
before update on public.trainings
for each row execute function public.set_updated_at();

drop trigger if exists set_deployments_updated_at on public.deployments;
create trigger set_deployments_updated_at
before update on public.deployments
for each row execute function public.set_updated_at();

drop trigger if exists set_engagements_updated_at on public.engagements;
create trigger set_engagements_updated_at
before update on public.engagements
for each row execute function public.set_updated_at();

drop trigger if exists tr_audit_trainings on public.trainings;
create trigger tr_audit_trainings
after insert or update or delete on public.trainings
for each row execute function public.log_audit_changes();

drop trigger if exists tr_audit_deployments on public.deployments;
create trigger tr_audit_deployments
after insert or update or delete on public.deployments
for each row execute function public.log_audit_changes();

drop trigger if exists tr_audit_engagements on public.engagements;
create trigger tr_audit_engagements
after insert or update or delete on public.engagements
for each row execute function public.log_audit_changes();
