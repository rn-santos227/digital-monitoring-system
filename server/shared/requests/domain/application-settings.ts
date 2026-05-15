export interface UpdateApplicationSettingsRequest {
  appName?: string
  appShortCode?: string
  appDescription?: string | null
  defaultTimezone?: string
  defaultLocale?: string
  defaultDateFormat?: string
  defaultTimeFormat?: '12h' | '24h'
  appTheme?: string
  densityMode?: 'compact' | 'comfortable' | 'spacious'
  pageSize?: number
  mapDefaultLatitude?: number
  mapDefaultLongitude?: number
  mapDefaultZoom?: number
}
