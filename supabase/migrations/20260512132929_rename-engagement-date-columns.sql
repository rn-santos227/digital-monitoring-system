
alter table public.engagements
  rename column date_start to start_date;

alter table public.engagements
  rename column date_end to end_date;

alter table public.engagements
  rename constraint engagements_date_check to engagements_start_end_date_check;

alter table public.engagements
  drop constraint if exists engagements_start_end_date_check;

alter table public.engagements
  add constraint engagements_start_end_date_check
  check (end_date is null or start_date is null or end_date >= start_date);

alter table public.engagement_records
  rename column date_start to start_date;

alter table public.engagement_records
  rename column date_end to end_date;

alter table public.engagement_records
  rename constraint engagement_records_date_check to engagement_records_start_end_date_check;

alter table public.engagement_records
  drop constraint if exists engagement_records_start_end_date_check;

alter table public.engagement_records
  add constraint engagement_records_start_end_date_check
  check (end_date is null or start_date is null or end_date >= start_date);

create index if not exists idx_engagements_start_date on public.engagements(start_date);
create index if not exists idx_engagement_records_start_date on public.engagement_records(start_date);
