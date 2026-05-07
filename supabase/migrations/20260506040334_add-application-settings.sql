create table if not exists public.application_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null unique default 'default',

  app_name text not null,
  app_short_code text not null,
  app_description text null,

  default_timezone text not null default 'Asia/Manila',
  default_locale text not null default 'en-PH',
  default_date_format text not null default 'YYYY-MM-DD',
  default_time_format text not null default '24h' check (default_time_format in ('12h', '24h')),

  app_theme text not null default 'emerald',
  density_mode text not null default 'comfortable' check (density_mode in ('compact', 'comfortable', 'spacious')),
  page_size integer not null default 20 check (page_size > 0),

  map_default_latitude numeric(9,6) not null default 12.879721,
  map_default_longitude numeric(9,6) not null default 121.774017,
  map_default_zoom integer not null default 6 check (map_default_zoom between 1 and 22),
  map_min_zoom integer not null default 4 check (map_min_zoom between 1 and 22),
  map_max_zoom integer not null default 18 check (map_max_zoom between 1 and 22),

  personnel_code_prefix text not null default 'AFP-P',
  equipment_asset_code_prefix text not null default 'AFP-E',

  enable_audit_log_retention boolean not null default true,
  audit_log_retention_days integer not null default 365 check (audit_log_retention_days > 0),
  enable_incident_notifications boolean not null default true,
  enable_equipment_maintenance_reminders boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint application_settings_latitude_check check (map_default_latitude >= -90 and map_default_latitude <= 90),
  constraint application_settings_longitude_check check (map_default_longitude >= -180 and map_default_longitude <= 180),
  constraint application_settings_zoom_range_check check (map_min_zoom <= map_default_zoom and map_default_zoom <= map_max_zoom)
);

create trigger trg_application_settings_updated_at
before update on public.application_settings
for each row
execute function public.set_updated_at();

insert into public.application_settings (
  singleton_key,
  app_name,
  app_short_code,
  app_description,
  default_timezone,
  app_theme,
  page_size,
  map_default_latitude,
  map_default_longitude,
  map_default_zoom
)
values (
  'default',
  'Digital AFP Personnel and Equipment Monitoring System',
  'DPEMS',
  'Personnel and equipment management system for military operational readiness and monitoring.',
  'Asia/Manila',
  'emerald',
  20,
  12.879721,
  121.774017,
  6
)
on conflict (singleton_key) do nothing;
