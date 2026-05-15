import { AUTH_LOCAL_STORAGE_KEYS } from '~/constants/api.constants'
import type { ApplicationSettingsItem } from '~/types/domain/application-settings'

const getApplicationSettingsStorage = () => {
  if (!import.meta.client) {
    return null
  }

  return localStorage
}

export const loadApplicationSettingsFromStorage = (): ApplicationSettingsItem | null => {
  const storage = getApplicationSettingsStorage()

  if (!storage) {
    return null
  }

  const rawValue = storage.getItem(AUTH_LOCAL_STORAGE_KEYS.applicationSettings) ?? ''

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
  const storage = getApplicationSettingsStorage()

  if (!storage) {
    return
  }

  storage.setItem(AUTH_LOCAL_STORAGE_KEYS.applicationSettings, JSON.stringify(item))
}

export const clearApplicationSettingsStorage = () => {
  const storage = getApplicationSettingsStorage()

  if (!storage) {
    return
  }

  storage.removeItem(AUTH_LOCAL_STORAGE_KEYS.applicationSettings)
}
