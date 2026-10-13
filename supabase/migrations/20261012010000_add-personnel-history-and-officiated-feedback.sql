begin;

create table public.personnel_employment_records (
  id uuid primary key default gen_random_uuid(),
  personnel_id uuid not null references public.personnel(id) on delete restrict,
  employer_name text not null check (length(btrim(employer_name)) between 1 and 200),
  job_title text not null check (length(btrim(job_title)) between 1 and 200),
  start_date date null,
  end_date date null,
  reference text null check (length(reference) <= 1000),
  remarks text null check (length(remarks) <= 3000),
  created_by uuid null references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create table public.personnel_education_records (
  id uuid primary key default gen_random_uuid(),
  personnel_id uuid not null references public.personnel(id) on delete restrict,
  institution_name text not null check (length(btrim(institution_name)) between 1 and 200),
  qualification_name text not null check (length(btrim(qualification_name)) between 1 and 200),
  education_level text null check (length(education_level) <= 100),
  start_date date null,
  end_date date null,
  reference text null check (length(reference) <= 1000),
  remarks text null check (length(remarks) <= 3000),
  created_by uuid null references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create index idx_personnel_employment_records_personnel_id on public.personnel_employment_records(personnel_id);
create index idx_personnel_education_records_personnel_id on public.personnel_education_records(personnel_id);

create trigger set_updated_at_personnel_employment_records before update on public.personnel_employment_records
  for each row execute function public.set_updated_at();
create trigger set_updated_at_personnel_education_records before update on public.personnel_education_records
  for each row execute function public.set_updated_at();

-- Officials are designated through this privilege rather than client-supplied names.
insert into public.permissions (code, name, module)
values ('personnel.feedback', 'Officiate Personnel Performance Feedback', 'personnel')
on conflict (code) do nothing;

insert into public.account_type_permissions (account_type_id, permission_id)
select at.id, p.id
from public.account_types at
join public.permissions p on p.code = 'personnel.feedback'
where at.code in ('ADMIN', 'COMMANDER')
on conflict (account_type_id, permission_id) do nothing;

create table public.personnel_performance_feedback (
  id uuid primary key default gen_random_uuid(),
  personnel_id uuid not null references public.personnel(id) on delete restrict,
  feedback text not null check (length(btrim(feedback)) between 1 and 6000),
  review_date date not null,
  rating integer null check (rating between 1 and 5),
  author_user_id uuid not null references public.user_profiles(id) on delete restrict,
  author_personnel_id uuid not null references public.personnel(id) on delete restrict,
  author_name text not null check (length(btrim(author_name)) > 0),
  author_title text null,
  author_rank text not null check (length(btrim(author_rank)) > 0),
  author_service_number text not null check (length(btrim(author_service_number)) > 0),
  authorship_confirmed boolean not null check (authorship_confirmed),
  officiated_at timestamptz not null default now()
);

create index idx_personnel_performance_feedback_personnel_id on public.personnel_performance_feedback(personnel_id);
create index idx_personnel_performance_feedback_author_user_id on public.personnel_performance_feedback(author_user_id);
create index idx_personnel_performance_feedback_author_personnel_id on public.personnel_performance_feedback(author_personnel_id);

create function public.enforce_personnel_feedback_officiation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_official public.user_profiles%rowtype;
  v_personnel public.personnel%rowtype;
  v_rank text;
begin
  if tg_op <> 'INSERT' then
    raise exception 'Officiated performance feedback cannot be edited or deleted. Record a new officiated entry for a correction.'
      using errcode = '55000';
  end if;

  if auth.uid() is not null and auth.uid() <> new.author_user_id then
    raise exception 'Feedback must be officiated by its author.' using errcode = '42501';
  end if;

  if not public.has_rbac_permission(new.author_user_id, 'personnel.feedback') then
    raise exception 'The author is not authorized to officiate feedback.' using errcode = '42501';
  end if;

  select * into v_official from public.user_profiles
  where id = new.author_user_id and is_active;
  if not found or v_official.personnel_id is null then
    raise exception 'An active official account linked to personnel is required.' using errcode = '23514';
  end if;

  select * into v_personnel from public.personnel where id = v_official.personnel_id;
  select name into v_rank from public.ranks where id = v_personnel.rank_id;
  if v_personnel.id is null or length(btrim(v_personnel.service_number)) = 0
    or v_rank is null or length(btrim(v_rank)) = 0 or new.authorship_confirmed is distinct from true then
    raise exception 'The author must confirm authorship and have a serial number and rank.' using errcode = '23514';
  end if;

  new.author_name := concat_ws(' ', v_personnel.first_name, nullif(v_personnel.middle_name, ''), v_personnel.last_name);
  new.author_personnel_id := v_official.personnel_id;
  new.author_title := v_personnel.position;
  new.author_rank := v_rank;
  new.author_service_number := v_personnel.service_number;
  new.officiated_at := current_timestamp;
  return new;
end;
$$;

create trigger enforce_personnel_feedback_officiation
  before insert or update or delete on public.personnel_performance_feedback
  for each row execute function public.enforce_personnel_feedback_officiation();

revoke all on function public.enforce_personnel_feedback_officiation() from public, anon, authenticated;

-- History is managed through the existing personnel privileges.
do $$
declare
  v_table text;
begin
  foreach v_table in array array['personnel_employment_records', 'personnel_education_records']
  loop
    execute format('alter table public.%I enable row level security', v_table);
    execute format('revoke all on public.%I from public, anon', v_table);
    execute format('grant select, insert, update, delete on public.%I to authenticated, service_role', v_table);
    execute format(
      'create policy personnel_history_read on public.%I for select to authenticated using (public.has_rbac_permission(auth.uid(), %L))',
      v_table, 'personnel.view'
    );
    execute format(
      'create policy personnel_history_insert on public.%I for insert to authenticated with check (public.has_rbac_permission(auth.uid(), %L))',
      v_table, 'personnel.update'
    );
    execute format(
      'create policy personnel_history_update on public.%I for update to authenticated using (public.has_rbac_permission(auth.uid(), %L)) with check (public.has_rbac_permission(auth.uid(), %L))',
      v_table, 'personnel.update', 'personnel.update'
    );
    execute format(
      'create policy personnel_history_delete on public.%I for delete to authenticated using (public.has_rbac_permission(auth.uid(), %L))',
      v_table, 'personnel.update'
    );
  end loop;
end;
$$;

alter table public.personnel_performance_feedback enable row level security;
revoke all on public.personnel_performance_feedback from public, anon, authenticated, service_role;
grant select, insert on public.personnel_performance_feedback to authenticated, service_role;

create policy personnel_feedback_read on public.personnel_performance_feedback
  for select to authenticated
  using (public.has_rbac_permission(auth.uid(), 'personnel.view'));
create policy personnel_feedback_sign on public.personnel_performance_feedback
  for insert to authenticated
  with check (
    public.has_rbac_permission(auth.uid(), 'personnel.feedback')
    and author_user_id = auth.uid()
  );

commit;
