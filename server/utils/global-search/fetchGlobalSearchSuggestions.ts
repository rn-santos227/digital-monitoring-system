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
import {
  buildGlobalSearchOrFilter,
  mapGlobalSearchEquipmentAssetSuggestion,
  mapGlobalSearchIncidentSuggestion,
  mapGlobalSearchPersonnelSuggestion,
  rankGlobalSearchSuggestions,
  userHasGlobalSearchPermission,
} from '../../shared/utils'

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

const GLOBAL_SEARCH_EQUIPMENT_ASSET_COLUMNS = [
  'asset_tag',
  'serial_no',
  'batch_no',
  'current_location',
  'remarks',
] as const

const GLOBAL_SEARCH_INCIDENT_COLUMNS = [
  'incident_no',
  'location',
  'description',
  'resolution',
  'remarks',
] as const

export const fetchGlobalSearchSuggestions = async (
  supabase: SupabaseClient,
  user: GlobalSearchAuthorizedUserPermissions,
  term: string,
): Promise<GlobalSearchSuggestionItem[]> => {
  const suggestionGroups: GlobalSearchSuggestionItem[][] = []

  if (userHasGlobalSearchPermission(user, PERMISSION_CODES.personnelView)) {
    const { data, error } = await supabase
      .from('vw_personnel_profile')
      .select(GLOBAL_SEARCH_PERSONNEL_SELECT_COLUMNS)
      .or(buildGlobalSearchOrFilter(term, GLOBAL_SEARCH_PERSONNEL_COLUMNS))
      .order('updated_at', { ascending: false })
      .limit(GLOBAL_SEARCH_SUGGESTION_LIMIT)

    if (error) {
      throw error
    }

    suggestionGroups.push(
      ((data ?? []) as GlobalSearchPersonnelRow[])
        .map(row => mapGlobalSearchPersonnelSuggestion(term, row)),
    )
  }

  if (userHasGlobalSearchPermission(user, PERMISSION_CODES.equipmentView)) {
    const { data: equipmentRows, error: equipmentError } = await supabase
      .from('equipment_assets')
      .select(GLOBAL_SEARCH_EQUIPMENT_ASSET_SELECT_COLUMNS)
      .or(buildGlobalSearchOrFilter(term, GLOBAL_SEARCH_EQUIPMENT_ASSET_COLUMNS))
      .order('updated_at', { ascending: false })
      .limit(GLOBAL_SEARCH_SUGGESTION_LIMIT)

    if (equipmentError) {
      throw equipmentError
    }

    suggestionGroups.push(
      ((equipmentRows ?? []) as GlobalSearchEquipmentAssetRow[])
        .map(row => mapGlobalSearchEquipmentAssetSuggestion(term, row)),
    )

    const { data: incidentRows, error: incidentError } = await supabase
      .from('equipment_incidents')
      .select(GLOBAL_SEARCH_INCIDENT_SELECT_COLUMNS)
      .or(buildGlobalSearchOrFilter(term, GLOBAL_SEARCH_INCIDENT_COLUMNS))
      .order('incident_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(GLOBAL_SEARCH_SUGGESTION_LIMIT)

    if (incidentError) {
      throw incidentError
    }

    suggestionGroups.push(
      ((incidentRows ?? []) as GlobalSearchIncidentRow[])
        .map(row => mapGlobalSearchIncidentSuggestion(term, row)),
    )
  }

  return rankGlobalSearchSuggestions(suggestionGroups)
}
