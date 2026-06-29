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

const GLOBAL_SEARCH_PERSONNEL_COLUMNS = [
  'personnel_code',
  'service_number',
  'email',
  'full_name',
  'rank_name',
  'company_name',
  'battalion_name',
  'service_status',
] as const

