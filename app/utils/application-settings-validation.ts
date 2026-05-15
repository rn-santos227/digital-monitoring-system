import type { UpdateApplicationSettingsPayload } from '~/types/domain/application-settings'

const PAGE_SIZE_MIN = 1
const PAGE_SIZE_MAX = 100

const isNonEmptyValue = (value: string) => value.trim().length > 0

export const validateApplicationSettingsUpdate = (payload: UpdateApplicationSettingsPayload): string | null => {
  if (!isNonEmptyValue(payload.appName)) {
    return 'Application name is required.'
  }

  if (!isNonEmptyValue(payload.appShortCode)) {
    return 'Application short code is required.'
  }

  if (!isNonEmptyValue(payload.defaultTimezone)) {
    return 'Default timezone is required.'
  }

  if (!isNonEmptyValue(payload.defaultLocale)) {
    return 'Default locale is required.'
  }

  if (!isNonEmptyValue(payload.defaultDateFormat)) {
    return 'Default date format is required.'
  }

  if (!['12h', '24h'].includes(payload.defaultTimeFormat)) {
    return 'Default time format must be 12h or 24h.'
  }

  if (!['compact', 'comfortable', 'spacious'].includes(payload.densityMode)) {
    return 'Density mode must be compact, comfortable, or spacious.'
  }

  if (!Number.isInteger(payload.pageSize) || payload.pageSize < PAGE_SIZE_MIN || payload.pageSize > PAGE_SIZE_MAX) {
    return `Page size must be between ${PAGE_SIZE_MIN} and ${PAGE_SIZE_MAX}.`
  }

  if (!Number.isFinite(payload.mapDefaultLatitude) || payload.mapDefaultLatitude < -90 || payload.mapDefaultLatitude > 90) {
    return 'Default map latitude must be between -90 and 90.'
  }

  if (!Number.isFinite(payload.mapDefaultLongitude) || payload.mapDefaultLongitude < -180 || payload.mapDefaultLongitude > 180) {
    return 'Default map longitude must be between -180 and 180.'
  }

  if (!Number.isInteger(payload.mapDefaultZoom) || payload.mapDefaultZoom < 1 || payload.mapDefaultZoom > 22) {
    return 'Default map zoom must be between 1 and 22.'
  }

  return null
}
