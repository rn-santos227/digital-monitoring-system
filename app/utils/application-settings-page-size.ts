import { loadApplicationSettingsFromStorage } from '~/utils/application-settings-storage'

const FALLBACK_FETCH_PAGE_SIZE = 10
const FETCH_PAGE_SIZE_MIN = 1
const FETCH_PAGE_SIZE_MAX = 100

export const normalizeFetchPageSize = (pageSize: unknown): number => {
  const parsedPageSize = typeof pageSize === 'number' ? Math.trunc(pageSize) : Number.NaN

  if (!Number.isFinite(parsedPageSize)) {
    return FALLBACK_FETCH_PAGE_SIZE
  }

  if (parsedPageSize < FETCH_PAGE_SIZE_MIN || parsedPageSize > FETCH_PAGE_SIZE_MAX) {
    return FALLBACK_FETCH_PAGE_SIZE
  }

  return parsedPageSize
}

export const resolveDefaultFetchPageSize = (): number => {
  if (!import.meta.client) {
    return FALLBACK_FETCH_PAGE_SIZE
  }

  const applicationSettings = loadApplicationSettingsFromStorage()

  return normalizeFetchPageSize(applicationSettings?.pageSize)
}
