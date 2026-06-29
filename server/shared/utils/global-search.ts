import { GLOBAL_SEARCH_SUGGESTION_LIMIT } from '../constants'
import type {
  GlobalSearchAuthorizedUserPermissions,
  GlobalSearchEquipmentAssetRow,
  GlobalSearchIncidentRow,
  GlobalSearchPersonnelRow,
  GlobalSearchSuggestionItem,
} from '../models'

export const normalizeGlobalSearchText = (value: string) => value.trim().toLocaleLowerCase()

export const toSingleGlobalSearchReference = <T>(value: T | T[] | null): T | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export const joinGlobalSearchParts = (parts: Array<string | null | undefined>) => parts
  .map(part => part?.trim() ?? '')
  .filter(part => part.length > 0)
  .join(' • ')

export const calculateGlobalSearchSuggestionScore = (
  term: string,
  parts: Array<string | null | undefined>,
) => {
  const normalizedTerm = normalizeGlobalSearchText(term)
  const normalizedParts = parts
    .map(part => normalizeGlobalSearchText(part ?? ''))
    .filter(part => part.length > 0)
  const exactIndex = normalizedParts.findIndex(part => part === normalizedTerm)

  if (exactIndex >= 0) {
    return 1000 - exactIndex
  }

  const prefixIndex = normalizedParts.findIndex(part => part.startsWith(normalizedTerm))

  if (prefixIndex >= 0) {
    return 800 - prefixIndex
  }

  const containsIndex = normalizedParts.findIndex(part => part.includes(normalizedTerm))
}
