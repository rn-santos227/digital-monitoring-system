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

