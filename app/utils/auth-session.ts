import { AUTH_HEADERS, AUTH_LOCAL_STORAGE_KEYS } from '~/constants/api.constants'

const isExpired = (expiresAt: string): boolean => {
  const expirationTimestamp = new Date(expiresAt).getTime()
  if (Number.isNaN(expirationTimestamp)) return true

  return Date.now() >= expirationTimestamp
}

const clearStoredSessionToken = (): void => {
  if (!import.meta.client) return

  localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken)
  localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.sessionTokenExpiresAt)
}

export const getStoredSessionToken = (): string => {
  if (!import.meta.client) return ''

  const sessionToken = localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken) ?? ''
  const expiresAt = localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionTokenExpiresAt) ?? ''

  if (!sessionToken) return ''

  if (!expiresAt || isExpired(expiresAt)) {
    clearStoredSessionToken()
    return ''
  }

  return sessionToken
}

