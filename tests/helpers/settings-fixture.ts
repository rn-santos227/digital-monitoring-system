import type { ApplicationSettingsItem } from '@/app/types/domain/application-settings'

export const settingsFixture: ApplicationSettingsItem = {
  id: 'settings',
  appName: 'AFP Monitoring',
  appShortCode: 'AFP',
  appDescription: null,
  defaultTimezone: 'Asia/Manila',
  defaultLocale: 'en-PH',
  defaultDateFormat: 'yyyy-MM-dd',
  defaultTimeFormat: '24h',
  appTheme: 'emerald',
  densityMode: 'comfortable',
  pageSize: 10,
  mapDefaultLatitude: 14.6,
  mapDefaultLongitude: 121,
  mapDefaultZoom: 10,
  mapMinZoom: 1,
  mapMaxZoom: 22,
}
