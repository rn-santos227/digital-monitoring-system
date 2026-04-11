export function getStoredSessionToken(storageKey: string): string | null {
  if (!import.meta.client) {
    return null
  }

  return localStorage.getItem(storageKey)
}
