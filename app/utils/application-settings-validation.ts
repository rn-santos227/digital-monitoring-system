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

  return null
}
