import type { SupabaseClient } from '@supabase/supabase-js'
import {
  GLOBAL_SEARCH_EQUIPMENT_ASSET_SELECT_COLUMNS,
  GLOBAL_SEARCH_INCIDENT_SELECT_COLUMNS,
  GLOBAL_SEARCH_PERSONNEL_SELECT_COLUMNS,
  GLOBAL_SEARCH_SUGGESTION_LIMIT,
  PERMISSION_CODES,
} from '../../shared/constants'
import type {
  GlobalSearchAuthorizedUserPermissions,
  GlobalSearchEquipmentAssetRow,
  GlobalSearchIncidentRow,
  GlobalSearchPersonnelRow,
  GlobalSearchSuggestionItem,
} from '../../shared/models'
