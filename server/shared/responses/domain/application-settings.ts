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
  updatedAt: string
}

export interface ApplicationSettingsResponse {
  item: ApplicationSettingsItem
}
