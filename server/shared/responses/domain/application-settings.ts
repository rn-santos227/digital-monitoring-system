export interface ApplicationSettingsItem {
  id: string
  appName: string
  appShortCode: string
  appDescription: string | null
  defaultTimezone: string
  defaultLocale: string
  defaultDateFormat: string
  defaultTimeFormat: '12h' | '24h'
  appTheme: string
  densityMode: 'compact' | 'comfortable' | 'spacious'
  pageSize: number
  mapDefaultLatitude: string | number
  mapDefaultLongitude: string | number
  mapDefaultZoom: number
  mapMinZoom: number
  mapMaxZoom: number
  personnelCodePrefix: string
  equipmentAssetCodePrefix: string
  enableAuditLogRetention: boolean
  auditLogRetentionDays: number
  enableIncidentNotifications: boolean
  enableEquipmentMaintenanceReminders: boolean
  createdAt: string
  updatedAt: string
}

export interface ApplicationSettingsResponse {
  item: ApplicationSettingsItem
}
