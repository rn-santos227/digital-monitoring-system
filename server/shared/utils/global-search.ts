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

