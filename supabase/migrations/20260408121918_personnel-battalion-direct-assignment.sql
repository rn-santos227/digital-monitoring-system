-- Allow personnel to be assigned directly to a battalion (without a company),
-- while preserving company-to-battalion consistency when both are set.

alter table public.personnel
  add column if not exists battalion_id uuid null references public.battalions(id) on delete restrict;

alter table public.personnel
  alter column company_id drop not null;

alter table public.personnel
  drop constraint if exists personnel_unit_assignment_check;

alter table public.personnel
  add constraint personnel_unit_assignment_check
  check (company_id is not null or battalion_id is not null);

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

