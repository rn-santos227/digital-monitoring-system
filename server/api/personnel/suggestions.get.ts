import { createError, defineEventHandler, getQuery } from 'h3'
import type { PersonnelSuggestionsResponse } from '../../shared/responses'
import {
  MANAGEMENT_PERMISSION_GROUPS,
  USER_PROFILE_PERSONNEL_LOOKUP_SELECT_COLUMNS,
} from '../../shared/constants'
import {
  buildAssignedPersonnelProfileMap,
  mapPersonnelSuggestionItem,
  parsePersonnelSuggestionQuery,
} from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { buildPersonnelSuggestionFilters } from '../../utils/personnel/buildPersonnelSuggestionFilters'
import { fetchPersonnelSuggestions } from '../../utils/personnel/fetchPersonnelSuggestions'

export default defineEventHandler(async (event): Promise<PersonnelSuggestionsResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.userProfileManagement)

  const query = getQuery(event)
  const { pageSize, selectedPersonnelId, term, excludeCompanyId, excludeBattalionId } = parsePersonnelSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedPersonnelId: query.selectedPersonnelId,
    excludeCompanyId: query.excludeCompanyId,
    excludeBattalionId: query.excludeBattalionId,
  })

  const supabase = getServiceSupabaseClient()
  const filters = term.length > 0 ? buildPersonnelSuggestionFilters(term) : []

  if (term.length > 0 && filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  const { data: mergedRows, error: suggestionError } = await fetchPersonnelSuggestions(
    supabase,
    pageSize,
    filters.length > 0 ? filters.join(',') : undefined,
    selectedPersonnelId,
    term,
    excludeCompanyId,
    excludeBattalionId,
  )

  if (suggestionError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch personnel suggestions: ${suggestionError.message}` })
  }

  const personnelIds = mergedRows.map((row) => row.id)
  if (personnelIds.length === 0) return { items: [] }

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

      if (!assigned) return true
      return selectedPersonnelId === row.id
    })
    .map((row) => mapPersonnelSuggestionItem(row, assignedByPersonnelId.get(row.id)?.email ?? null))

  return { items }
})
