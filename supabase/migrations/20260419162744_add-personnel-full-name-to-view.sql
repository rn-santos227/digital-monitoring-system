drop view if exists public.vw_personnel_profile;

create view public.vw_personnel_profile
with (security_invoker = true) as
select
  p.id,
  p.personnel_code,
  p.service_number,
  p.email,
  p.last_name,
  p.first_name,
  p.middle_name,
  concat_ws(', ', p.last_name, concat_ws(' ', p.first_name, coalesce(p.middle_name, ''))) as full_name,
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
  p.employment_status_id,
  es.name as employment_status,
  p.service_status_id,
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
