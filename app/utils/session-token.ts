export function getStoredSessionToken(storageKey: string): string | null {
  if (!import.meta.client) {
    return null
  }

  return localStorage.getItem(storageKey)
}

export function persistSessionToken(storageKey: string, token?: string): void {
  if (!import.meta.client) {
    return
  }

  if (token) {
    localStorage.setItem(storageKey, token)
    return
  }

  localStorage.removeItem(storageKey)
}

export function buildSessionHeaders(headerName: string, sessionToken: string | null): Record<string, string> | undefined {
  if (!sessionToken) {
    return undefined
  }

  return {
    [headerName]: sessionToken,
  }
}
