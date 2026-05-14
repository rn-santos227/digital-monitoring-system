import type { ApplicationSettingsRow } from '../../shared/models'

export interface ApplicationSettingsChangeItem {
  field: keyof ApplicationSettingsRow
  oldValue: ApplicationSettingsRow[keyof ApplicationSettingsRow]
  newValue: ApplicationSettingsRow[keyof ApplicationSettingsRow]
}

export const toApplicationSettingsItem = (settings: ApplicationSettingsRow) => ({
  id: settings.id,
  appName: settings.app_name,
  appShortCode: settings.app_short_code,
  appDescription: settings.app_description,
  defaultTimezone: settings.default_timezone,
  defaultLocale: settings.default_locale,
  defaultDateFormat: settings.default_date_format,
  defaultTimeFormat: settings.default_time_format,
  appTheme: settings.app_theme,
  densityMode: settings.density_mode,
  pageSize: settings.page_size,
  mapDefaultLatitude: settings.map_default_latitude,
  mapDefaultLongitude: settings.map_default_longitude,
  mapDefaultZoom: settings.map_default_zoom,
  mapMinZoom: settings.map_min_zoom,
  mapMaxZoom: settings.map_max_zoom,
  personnelCodePrefix: settings.personnel_code_prefix,
  equipmentAssetCodePrefix: settings.equipment_asset_code_prefix,
  enableAuditLogRetention: settings.enable_audit_log_retention,
  auditLogRetentionDays: settings.audit_log_retention_days,
  enableIncidentNotifications: settings.enable_incident_notifications,
  enableEquipmentMaintenanceReminders: settings.enable_equipment_maintenance_reminders,
  createdAt: settings.created_at,
  updatedAt: settings.updated_at,
})

export const toApplicationSettingsAuditRecord = (settings: ApplicationSettingsRow): ApplicationSettingsRow => ({
  id: settings.id,
  singleton_key: settings.singleton_key,
  app_name: settings.app_name,
  app_short_code: settings.app_short_code,
  app_description: settings.app_description,
  default_timezone: settings.default_timezone,
  default_locale: settings.default_locale,
  default_date_format: settings.default_date_format,
  default_time_format: settings.default_time_format,
  app_theme: settings.app_theme,
  density_mode: settings.density_mode,
  page_size: settings.page_size,
  map_default_latitude: settings.map_default_latitude,
  map_default_longitude: settings.map_default_longitude,
  map_default_zoom: settings.map_default_zoom,
  map_min_zoom: settings.map_min_zoom,
  map_max_zoom: settings.map_max_zoom,
  personnel_code_prefix: settings.personnel_code_prefix,
  equipment_asset_code_prefix: settings.equipment_asset_code_prefix,
  enable_audit_log_retention: settings.enable_audit_log_retention,
  audit_log_retention_days: settings.audit_log_retention_days,
  enable_incident_notifications: settings.enable_incident_notifications,
  enable_equipment_maintenance_reminders: settings.enable_equipment_maintenance_reminders,
  created_at: settings.created_at,
  updated_at: settings.updated_at,
})

export const buildSettingsChangeSet = (before: ApplicationSettingsRow, after: ApplicationSettingsRow): { changedValues: ApplicationSettingsChangeItem[] } => {
  const beforeRecord = toApplicationSettingsAuditRecord(before)
  const afterRecord = toApplicationSettingsAuditRecord(after)
  const changedValues: ApplicationSettingsChangeItem[] = []

  ;(Object.keys(afterRecord) as Array<keyof ApplicationSettingsRow>).forEach((field) => {
    const oldValue = beforeRecord[field]
    const newValue = afterRecord[field]

    if (oldValue !== newValue) {
      changedValues.push({ field, oldValue, newValue })
    }
  })

  return { changedValues }
}
