grant select, insert, update, delete on table public.auth_sessions to service_role;

-- Enforce RLS on all public base tables and keep policies service-role only.
do $$
declare
  t record;
  policy_name text := 'service_role_full_access';
begin
  for t in
    select tablename
    from pg_tables
    where schemaname = 'public'
      and tablename not like 'pg_%'
  loop
    execute format('alter table public.%I enable row level security', t.tablename);
    execute format('alter table public.%I force row level security', t.tablename);

    execute format('drop policy if exists %I on public.%I', policy_name, t.tablename);
    execute format(
      'create policy %I on public.%I for all to service_role using (true) with check (true)',
      policy_name,
      t.tablename
    );

    -- Explicitly block anon/authenticated at table privilege layer as defense-in-depth.
    execute format('revoke all on table public.%I from anon', t.tablename);
    execute format('revoke all on table public.%I from authenticated', t.tablename);
  end loop;
end;
$$;

-- Security definer views should be invoker security in Supabase.
do $$
begin
  if to_regclass('public.active_auth_sessions') is not null then
    execute 'alter view public.active_auth_sessions set (security_invoker = true)';
  end if;

  if to_regclass('public.vw_personnel_profile') is not null then
    execute 'alter view public.vw_personnel_profile set (security_invoker = true)';
  end if;

  if to_regclass('public.vw_dashboard_kpis') is not null then
    execute 'alter view public.vw_dashboard_kpis set (security_invoker = true)';
  end if;

  if to_regclass('public.vw_equipment_accountability') is not null then
    execute 'alter view public.vw_equipment_accountability set (security_invoker = true)';
  end if;

  if to_regclass('public.vw_equipment_serviceability') is not null then
    execute 'alter view public.vw_equipment_serviceability set (security_invoker = true)';
  end if;
end;
$$;
