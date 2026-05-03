import { defineEventHandler, getQuery } from 'h3'
import type { CompanySuggestionsResponse } from '../../shared/responses'
import { UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapCompanySuggestionItem, parseUnitSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchCompanySuggestions } from '../../utils/companies/fetchCompanySuggestions'
import { getCompanySuggestionById } from '../../utils/companies/getCompanySuggestionById'

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
  const mergedRows = await fetchCompanySuggestions(supabase, term, pageSize, battalionId)

  if (selectedId && !mergedRows.some(row => row.id === selectedId)) {
    const selectedRow = await getCompanySuggestionById(supabase, selectedId)

    if (selectedRow) {
      mergedRows.unshift(selectedRow)
    }
  }

  return { items: mergedRows.map(mapCompanySuggestionItem) }
})
