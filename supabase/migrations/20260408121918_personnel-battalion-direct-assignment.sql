-- Allow personnel to be assigned directly to a battalion (without a company),
-- while preserving company-to-battalion consistency when both are set.

alter table public.personnel
  add column if not exists battalion_id uuid null references public.battalions(id) on delete restrict;

alter table public.personnel
  alter column company_id drop not null;

create or replace function public.validate_personnel_unit_assignment()
returns trigger
language plpgsql
as $$
declare
  v_company_battalion_id uuid;
begin
  if new.company_id is not null then
    select c.battalion_id into v_company_battalion_id
    from public.companies c
    where c.id = new.company_id;

    if new.battalion_id is not null and v_company_battalion_id is distinct from new.battalion_id then
      raise exception 'Personnel battalion must match the selected company battalion';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists tr_validate_personnel_unit_assignment on public.personnel;

create trigger tr_validate_personnel_unit_assignment
before insert or update on public.personnel
for each row execute function public.validate_personnel_unit_assignment();

create or replace function public.validate_equipment_asset_assignment()
returns trigger
language plpgsql
as $$
declare
  v_company_battalion_id uuid;
  v_personnel_company_id uuid;
  v_personnel_battalion_id uuid;
begin
  if new.assigned_company_id is not null then
    select c.battalion_id into v_company_battalion_id
    from public.companies c
    where c.id = new.assigned_company_id;

    if new.assigned_battalion_id is not null and v_company_battalion_id is distinct from new.assigned_battalion_id then
      raise exception 'Assigned company must belong to the assigned battalion';
    end if;
  end if;

  if new.assigned_personnel_id is not null then
    select p.company_id, coalesce(p.battalion_id, c.battalion_id)
      into v_personnel_company_id, v_personnel_battalion_id
    from public.personnel p
    left join public.companies c on c.id = p.company_id
    where p.id = new.assigned_personnel_id;

    if new.assigned_company_id is not null and v_personnel_company_id is distinct from new.assigned_company_id then
      raise exception 'Assigned personnel must belong to the assigned company';
    end if;

    if new.assigned_battalion_id is not null and v_personnel_battalion_id is distinct from new.assigned_battalion_id then
      raise exception 'Assigned personnel must belong to the assigned battalion';
    end if;
  end if;

  return new;
end;
$$;

create or replace function public.validate_equipment_issuance_assignment()
returns trigger
language plpgsql
as $$
declare
  v_asset_company_id uuid;
  v_asset_battalion_id uuid;
  v_personnel_company_id uuid;
  v_personnel_battalion_id uuid;
begin
  select ea.assigned_company_id, ea.assigned_battalion_id
    into v_asset_company_id, v_asset_battalion_id
  from public.equipment_assets ea
  where ea.id = new.equipment_asset_id;

  select p.company_id, coalesce(p.battalion_id, c.battalion_id)
    into v_personnel_company_id, v_personnel_battalion_id
  from public.personnel p
  left join public.companies c on c.id = p.company_id
  where p.id = new.issued_to_personnel_id;

  if v_asset_company_id is not null and v_personnel_company_id is distinct from v_asset_company_id then
    raise exception 'Equipment assigned to a company can only be issued to personnel from that company';
  end if;

  if v_asset_battalion_id is not null and v_personnel_battalion_id is distinct from v_asset_battalion_id then
    raise exception 'Equipment assigned to a battalion can only be issued within that battalion';
  end if;

  return new;
end;
$$;

create or replace view public.vw_personnel_profile
with (security_invoker = true) as
select
  p.id,
  p.personnel_code,
  p.service_number,
  p.last_name,
  p.first_name,
  p.middle_name,
  p.sex,
  p.birthdate,
  p.rank_id,
  p.company_id,
  p.battalion_id,
  r.code as rank_code,
  r.name as rank_name,
  c.code as company_code,
  c.name as company_name,
  b.code as battalion_code,
  b.name as battalion_name,
  es.name as employment_status,
  ss.name as service_status,
  p.contact_number,
  p.position,
  p.date_enlisted,
  p.created_at,
  p.updated_at
from public.personnel p
join public.ranks r on r.id = p.rank_id
left join public.companies c on c.id = p.company_id
left join public.battalions b on b.id = coalesce(p.battalion_id, c.battalion_id)
join public.employment_statuses es on es.id = p.employment_status_id
join public.service_statuses ss on ss.id = p.service_status_id;
