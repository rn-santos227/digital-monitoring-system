begin;

-- Older databases do not yet have the quantity field used by issuance forms.
alter table public.equipment_issuances
  add column if not exists quantity_issued integer not null default 1
  check (quantity_issued > 0);

-- One row per asset. The latest issuance supersedes older issuance history.
-- Acquisition cost is the PHP unit price; null means the price is unknown.
create or replace view public.vw_equipment_assignment_values
with (security_invoker = true) as
with latest_issuance as (
  select distinct on (ei.equipment_asset_id)
    ei.equipment_asset_id,
    ei.issued_to_personnel_id,
    ei.quantity_issued,
    ei.actual_return_date,
    ist.name as status_name
  from public.equipment_issuances ei
  join public.issuance_statuses ist on ist.id = ei.status_id
  order by ei.equipment_asset_id, ei.issue_date desc, ei.created_at desc, ei.id desc
), holders as (
  select
    ea.*,
    case
      when li.actual_return_date is null and li.status_name in ('Issued', 'Overdue')
        then li.issued_to_personnel_id
      else ea.assigned_personnel_id
    end as holder_personnel_id,
    case
      when li.actual_return_date is null and li.status_name in ('Issued', 'Overdue')
        then li.quantity_issued
      else 1
    end as assigned_quantity
  from public.equipment_assets ea
  left join latest_issuance li on li.equipment_asset_id = ea.id
)
select
  h.id as equipment_asset_id,
  h.asset_tag,
  item.name as item_name,
  h.acquisition_cost,
  h.assigned_quantity as quantity,
  h.acquisition_cost * h.assigned_quantity as assigned_value,
  h.holder_personnel_id as personnel_id,
  case
    when h.holder_personnel_id is not null then p.company_id
    else h.assigned_company_id
  end as company_id,
  case
    when h.holder_personnel_id is not null then coalesce(p.battalion_id, pc.battalion_id)
    else coalesce(h.assigned_battalion_id, ac.battalion_id)
  end as battalion_id
from holders h
join public.equipment_items item on item.id = h.equipment_item_id
left join public.personnel p on p.id = h.holder_personnel_id
left join public.companies pc on pc.id = p.company_id
left join public.companies ac on ac.id = h.assigned_company_id;

-- Aggregate in the database so totals include every page of the detail table.
create or replace view public.vw_equipment_assignment_value_totals
with (security_invoker = true) as
select
  subject.subject_type,
  subject.subject_id,
  count(*) as asset_count,
  sum(v.quantity) as quantity,
  count(*) filter (where v.acquisition_cost is null) as unpriced_asset_count,
  coalesce(sum(v.assigned_value), 0) as total_value
from public.vw_equipment_assignment_values v
cross join lateral (values
  ('personnel'::text, v.personnel_id),
  ('company'::text, v.company_id),
  ('battalion'::text, v.battalion_id)
) as subject(subject_type, subject_id)
where subject.subject_id is not null
group by subject.subject_type, subject.subject_id;

-- Access is through the server's RBAC-gated endpoint only.
revoke all on public.vw_equipment_assignment_values from public, anon, authenticated;
revoke all on public.vw_equipment_assignment_value_totals from public, anon, authenticated;
grant select on public.vw_equipment_assignment_values to service_role;
grant select on public.vw_equipment_assignment_value_totals to service_role;

commit;
