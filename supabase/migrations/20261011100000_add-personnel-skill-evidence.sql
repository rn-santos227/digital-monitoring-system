begin;

-- Skills use the existing qualification records and preserve older entries.
alter table public.personnel_qualifications
  add column skill_source text null,
  add column training_record_id uuid null,
  add column external_reference text null;

create unique index training_records_id_personnel_id_key
  on public.training_records (id, personnel_id);

alter table public.personnel_qualifications
  add constraint personnel_qualifications_skill_training_owner_fkey
    foreign key (training_record_id, personnel_id)
    references public.training_records (id, personnel_id)
    on delete restrict on update restrict,
  add constraint personnel_qualifications_skill_evidence_check check (
    (skill_source is null and training_record_id is null and external_reference is null)
    or (
      skill_source = 'training'
      and training_record_id is not null
      and external_reference is null
    )
    or (
      skill_source = 'external'
      and training_record_id is null
      and external_reference is not null
      and length(btrim(external_reference)) between 1 and 1000
    )
  );

create index idx_personnel_qualifications_training_record_id
  on public.personnel_qualifications (training_record_id);

-- Null sources are retained only for pre-existing qualifications.
create function public.validate_personnel_skill_evidence()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.skill_source is null then
    raise exception 'A personnel skill requires supporting training or an external reference.'
      using errcode = '23514';
  end if;
  if length(btrim(new.qualification_type)) not between 1 and 160 then
    raise exception 'Skill name is required and must not exceed 160 characters.'
      using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger validate_personnel_skill_evidence
  before insert or update on public.personnel_qualifications
  for each row execute function public.validate_personnel_skill_evidence();

alter table public.personnel_qualifications enable row level security;

drop policy if exists authenticated_select_policy on public.personnel_qualifications;
drop policy if exists authenticated_insert_policy on public.personnel_qualifications;
drop policy if exists authenticated_update_policy on public.personnel_qualifications;
drop policy if exists authenticated_delete_policy on public.personnel_qualifications;

create policy authenticated_select_policy on public.personnel_qualifications
  for select to authenticated
  using (public.has_rbac_permission(auth.uid(), 'personnel.view'));
create policy authenticated_insert_policy on public.personnel_qualifications
  for insert to authenticated
  with check (public.has_rbac_permission(auth.uid(), 'personnel.update'));
create policy authenticated_update_policy on public.personnel_qualifications
  for update to authenticated
  using (public.has_rbac_permission(auth.uid(), 'personnel.update'))
  with check (public.has_rbac_permission(auth.uid(), 'personnel.update'));
create policy authenticated_delete_policy on public.personnel_qualifications
  for delete to authenticated
  using (public.has_rbac_permission(auth.uid(), 'personnel.update'));

revoke all on public.personnel_qualifications from anon;
grant select, insert, update, delete on public.personnel_qualifications to authenticated, service_role;
revoke all on function public.validate_personnel_skill_evidence() from public, anon, authenticated;

commit;
