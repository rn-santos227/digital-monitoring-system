import { defineEventHandler, getQuery } from 'h3'
import type { BattalionSuggestionsResponse } from '../../shared/responses'
import { UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapBattalionSuggestionItem, parseUnitSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchBattalionSuggestions } from '../../utils/battalions/fetchBattalionSuggestions'

const SEARCHABLE_FIELDS = ['code', 'name'] as const

export default defineEventHandler(async (event): Promise<BattalionSuggestionsResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.battalionManagement)

  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseUnitSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
  })

  const supabase = getServiceSupabaseClient()
  const { rows } = await fetchBattalionSuggestions(supabase, {
    term,
    pageSize,
    selectedId,
    searchableFields: SEARCHABLE_FIELDS,
  })

  return {
    items: rows.map(mapBattalionSuggestionItem),
  }
})
