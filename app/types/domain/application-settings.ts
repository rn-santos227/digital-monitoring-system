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
}

export interface ApplicationSettingsResponse {
  item: ApplicationSettingsItem
}

export interface UpdateApplicationSettingsPayload {
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
  mapDefaultLatitude: number
  mapDefaultLongitude: number
  mapDefaultZoom: number
}

export interface ApplicationSettingsState {
  item: ApplicationSettingsItem | null
  hasLoaded: boolean
  isLoading: boolean
  isSubmitting: boolean
  loadError: string
  updateError: string
}
