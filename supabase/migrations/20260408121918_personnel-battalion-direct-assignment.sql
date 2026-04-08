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
