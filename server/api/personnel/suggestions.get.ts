import { createError, defineEventHandler, getQuery } from 'h3'
import type { PersonnelSuggestionsResponse } from '../../shared/responses'
import {
  MANAGEMENT_PERMISSION_GROUPS,
  PERSONNEL_SUGGESTION_SELECT_COLUMNS,
  USER_PROFILE_PERSONNEL_LOOKUP_SELECT_COLUMNS,
} from '../../shared/constants'
import {
  buildAssignedPersonnelProfileMap,
  mapPersonnelSuggestionItem,
  parsePersonnelSuggestionQuery,
} from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_PERSONNEL_FIELDS = [
  'personnel_code',
  'service_number',
  'full_name',
] as const

export default defineEventHandler(async (event): Promise<PersonnelSuggestionsResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.userProfileManagement)

  const query = getQuery(event)
  const { pageSize, selectedPersonnelId, term } = parsePersonnelSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedPersonnelId: query.selectedPersonnelId,
  })

  const supabase = getServiceSupabaseClient()
  let personnelQuery = supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_SUGGESTION_SELECT_COLUMNS)
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .limit(pageSize)

  if (term.length > 0) {
    const filters = SEARCHABLE_PERSONNEL_FIELDS.map((field) => `${field}.ilike.%${term}%`)

    if (filters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
    }

    personnelQuery = personnelQuery.or(filters.join(','))
  }

  const { data: personnelRows, error: personnelError } = await personnelQuery

  if (personnelError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch personnel suggestions: ${personnelError.message}` })
  }

  const mergedRows = [...(personnelRows ?? [])]

  if (selectedPersonnelId && !mergedRows.some(row => row.id === selectedPersonnelId)) {
    const { data: selectedRow, error: selectedRowError } = await supabase
      .from('vw_personnel_profile')
      .select(PERSONNEL_SUGGESTION_SELECT_COLUMNS)
      .eq('id', selectedPersonnelId)
      .maybeSingle()

    if (selectedRowError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to fetch selected personnel suggestion: ${selectedRowError.message}` })
    }

    if (selectedRow) {
      mergedRows.unshift(selectedRow)
    }
  }

  const personnelIds = mergedRows.map((row) => row.id)

  if (personnelIds.length === 0) {
    return {
      items: [],
    }
  }

  const { data: assignedProfiles, error: assignedProfilesError } = await supabase
    .from('user_profiles')
    .select(USER_PROFILE_PERSONNEL_LOOKUP_SELECT_COLUMNS)
    .in('personnel_id', personnelIds)

  if (assignedProfilesError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to validate assigned personnel records: ${assignedProfilesError.message}` })
  }

  const assignedByPersonnelId = buildAssignedPersonnelProfileMap(assignedProfiles ?? [])

  const items = mergedRows
    .filter((row) => {
      const assigned = assignedByPersonnelId.get(row.id)

      if (!assigned) {
        return true
      }

      return selectedPersonnelId === row.id
    })
    .map((row) => {
      const assigned = assignedByPersonnelId.get(row.id)
      return mapPersonnelSuggestionItem(row, assigned?.email ?? null)
    })

  return {
    items,
  }
})
