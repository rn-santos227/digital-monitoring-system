export interface ApplicationSettingsRow {
  id: string
  singleton_key: string
  app_name: string
  app_short_code: string
  app_description: string | null
  default_timezone: string
  default_locale: string
  default_date_format: string
  default_time_format: '12h' | '24h'
  app_theme: string
  density_mode: 'compact' | 'comfortable' | 'spacious'
  page_size: number
  map_default_latitude: string | number
  map_default_longitude: string | number
  map_default_zoom: number
  map_min_zoom: number
  map_max_zoom: number
  personnel_code_prefix: string
  equipment_asset_code_prefix: string
  enable_audit_log_retention: boolean
  audit_log_retention_days: number
  enable_incident_notifications: boolean
  enable_equipment_maintenance_reminders: boolean
  created_at: string
  updated_at: string
}
