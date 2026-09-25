insert into public.permissions (code, name, module)
values ('backup.download', 'Download System Backup', 'backup')
on conflict (code) do update
set name = excluded.name,
    module = excluded.module;

insert into public.account_type_permissions (account_type_id, permission_id)
select account_types.id, permissions.id
from public.account_types
cross join public.permissions
where account_types.code = 'ADMIN'
  and permissions.code = 'backup.download'
on conflict (account_type_id, permission_id) do nothing;
