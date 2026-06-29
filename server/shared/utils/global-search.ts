import { GLOBAL_SEARCH_SUGGESTION_LIMIT } from '../constants'
import type {
  GlobalSearchAuthorizedUserPermissions,
  GlobalSearchEquipmentAssetRow,
  GlobalSearchIncidentRow,
  GlobalSearchPersonnelRow,
  GlobalSearchSuggestionItem,
} from '../models'

export const normalizeGlobalSearchText = (value: string) => value.trim().toLocaleLowerCase()


