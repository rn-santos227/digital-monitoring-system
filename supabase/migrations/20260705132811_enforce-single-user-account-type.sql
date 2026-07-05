with ranked_user_account_types as (
  select
    id,
    row_number() over (
      partition by user_id
      order by assigned_at asc, id asc
    ) as assignment_rank
  from public.user_account_types
)
delete from public.user_account_types uat
using ranked_user_account_types ranked
where uat.id = ranked.id
  and ranked.assignment_rank > 1;
