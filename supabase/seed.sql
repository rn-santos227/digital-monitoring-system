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

-- Starter units (self-referencing with HQ parent)
with upsert_hq as (
  insert into public.units (code, name, parent_unit_id, unit_type, is_active)
  values ('HQ', 'Headquarters', null, 'Command', true)
  on conflict (code) do update
  set name = excluded.name,
      unit_type = excluded.unit_type,
      is_active = excluded.is_active
  returning id
)
insert into public.units (code, name, parent_unit_id, unit_type, is_active)
select 'A-COMP', 'Alpha Company', id, 'Company', true from upsert_hq
on conflict (code) do update
set name = excluded.name,
    parent_unit_id = excluded.parent_unit_id,
    unit_type = excluded.unit_type,
    is_active = excluded.is_active;

with resolved_hq as (
  select id from public.units where code = 'HQ' limit 1
)
insert into public.units (code, name, parent_unit_id, unit_type, is_active)
select 'B-COMP', 'Bravo Company', id, 'Company', true from resolved_hq
on conflict (code) do update
set name = excluded.name,
    parent_unit_id = excluded.parent_unit_id,
    unit_type = excluded.unit_type,
    is_active = excluded.is_active;
