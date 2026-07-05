with ranked_user_account_types as (
  select
    id,
    row_number() over (
      partition by user_id
      order by assigned_at asc, id asc
    ) as assignment_rank
  from public.user_account_types
)
