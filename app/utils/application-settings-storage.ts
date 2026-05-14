import { AUTH_LOCAL_STORAGE_KEYS } from '~/constants/api.constants'
import type { ApplicationSettingsItem } from '~/types/domain/application-settings'

export const loadApplicationSettingsFromStorage = (): ApplicationSettingsItem | null => {
  const rawValue = localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.applicationSettings) ?? ''

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue) as ApplicationSettingsItem
  } catch {
    return null
  }
}

export const saveApplicationSettingsToStorage = (item: ApplicationSettingsItem) => {
  localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.applicationSettings, JSON.stringify(item))
}

export const clearApplicationSettingsStorage = () => {
  localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.applicationSettings)
}
