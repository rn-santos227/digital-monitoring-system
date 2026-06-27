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

export const saveSessionToken = (token?: string, expiresAt?: string): void => {
  if (!import.meta.client) return

  if (!token || !expiresAt) {
    clearStoredSessionToken()
    return
  }

  if (isExpired(expiresAt)) {
    clearStoredSessionToken()
    return
  }

  localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.sessionToken, token)
  localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.sessionTokenExpiresAt, expiresAt)

  const msUntilExpiry = new Date(expiresAt).getTime() - Date.now()
  if (msUntilExpiry > 0) {
    window.setTimeout(() => {
      const storedExpiry = localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.sessionTokenExpiresAt) ?? ''
      if (storedExpiry && isExpired(storedExpiry)) {
        clearStoredSessionToken()
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
