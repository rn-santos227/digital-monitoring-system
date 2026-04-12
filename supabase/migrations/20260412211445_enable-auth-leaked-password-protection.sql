do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'config'
      and column_name = 'password_hibp_enabled'
  ) then
    execute 'update auth.config set password_hibp_enabled = true';
  elsif exists (
    select 1
    from information_schema.columns
    where table_schema = 'auth'
      and table_name = 'config'
      and column_name = 'leaked_password_protection_enabled'
  ) then
    execute 'update auth.config set leaked_password_protection_enabled = true';
  else
    raise notice 'No leaked-password protection column found on auth.config; no change applied.';
  end if;
end;
$$;
