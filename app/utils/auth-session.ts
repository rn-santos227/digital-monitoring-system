import { AUTH_HEADERS, AUTH_LOCAL_STORAGE_KEYS } from '~/constants/api.constants'

const isExpired = (expiresAt: string): boolean => {
  const expirationTimestamp = new Date(expiresAt).getTime()
  if (Number.isNaN(expirationTimestamp)) return true

  return Date.now() >= expirationTimestamp
}

const getClientStorageTargets = (): Storage[] => {
  if (!import.meta.client) return []

  return [localStorage, sessionStorage]
}

const clearStoredSessionToken = (): void => {
  for (const storage of getClientStorageTargets()) {
    storage.removeItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken)
    storage.removeItem(AUTH_LOCAL_STORAGE_KEYS.sessionTokenExpiresAt)
  }
}

const getStoredSessionTokenFromStorage = (storage: Storage): string => {
  const sessionToken = storage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken) ?? ''
  const expiresAt = storage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionTokenExpiresAt) ?? ''

  if (!sessionToken) return ''

  if (!expiresAt || isExpired(expiresAt)) {
    storage.removeItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken)
    storage.removeItem(AUTH_LOCAL_STORAGE_KEYS.sessionTokenExpiresAt)
    return ''
  }

  return sessionToken
}

export const getStoredSessionToken = (): string => {
  if (!import.meta.client) return ''

  for (const storage of getClientStorageTargets()) {
    const sessionToken = getStoredSessionTokenFromStorage(storage)

    if (sessionToken) {
      return sessionToken
    }
  }

  return ''
}

export const saveSessionToken = (token?: string, expiresAt?: string, rememberSession = true): void => {
  if (!import.meta.client) return

  clearStoredSessionToken()

  if (!token || !expiresAt) {
    return
  }

  if (isExpired(expiresAt)) {
    return
  }

  const storage = rememberSession ? localStorage : sessionStorage
  storage.setItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken, token)
  storage.setItem(AUTH_LOCAL_STORAGE_KEYS.sessionTokenExpiresAt, expiresAt)

  const msUntilExpiry = new Date(expiresAt).getTime() - Date.now()
  if (msUntilExpiry > 0) {
    window.setTimeout(() => {
      const storedExpiry = storage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionTokenExpiresAt) ?? ''
      if (storedExpiry && isExpired(storedExpiry)) {
        storage.removeItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken)
        storage.removeItem(AUTH_LOCAL_STORAGE_KEYS.sessionTokenExpiresAt)
      }
    }, msUntilExpiry)
  }
}

export const getServerSessionHeaders = (): Record<string, string> => {
  if (!import.meta.server) {
    return {}
  }

  const requestHeaders = useRequestHeaders(['cookie'])
  const cookie = requestHeaders.cookie?.trim() ?? ''

  if (!cookie) {
    return {}
  }

  return { cookie }
}

export const createSessionHeaders = (): Record<string, string> => {
  const sessionToken = getStoredSessionToken()
  if (!sessionToken) return {}

  return {
    [AUTH_HEADERS.sessionToken]: sessionToken,
  }
}
