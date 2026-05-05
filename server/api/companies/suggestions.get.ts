import { defineEventHandler, getQuery } from 'h3'
import type { CompanySuggestionsResponse } from '../../shared/responses'
import { UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapCompanySuggestionItem, parseUnitSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchCompanySuggestions } from '../../utils/companies/fetchCompanySuggestions'

export default defineEventHandler(async (event): Promise<CompanySuggestionsResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.companyManagement)

  const query = getQuery(event)
  const { battalionId, pageSize, selectedId, term } = parseUnitSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
    battalionId: query.battalionId,
  })

  const supabase = getServiceSupabaseClient()
  const rows = await fetchCompanySuggestions(supabase, term, pageSize, battalionId, selectedId)

  return { items: rows.map(mapCompanySuggestionItem) }
})
