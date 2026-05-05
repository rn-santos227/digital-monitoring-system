import { defineEventHandler, getQuery } from 'h3'
import type { EngagementSuggestionsResponse } from '../../shared/responses'
import { ENGAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapEngagementSuggestionItem, parseEngagementSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEngagementSuggestions } from '../../utils/engagements/fetchEngagementSuggestions'

export default defineEventHandler(async (event): Promise<EngagementSuggestionsResponse> => {
  await requireAnyPermission(event, ENGAGEMENT_PERMISSION_GROUPS.engagementManagement)
  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseEngagementSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
  })

  const supabase = getServiceSupabaseClient()
  const rows = await fetchEngagementSuggestions(supabase, pageSize, term, selectedId)

  return { items: rows.map(mapEngagementSuggestionItem) }
})
