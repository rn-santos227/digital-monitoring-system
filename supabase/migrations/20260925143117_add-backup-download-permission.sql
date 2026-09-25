insert into public.permissions (code, name, module)
values ('backup.download', 'Download System Backup', 'backup')
on conflict (code) do update
set name = excluded.name,
    module = excluded.module;
