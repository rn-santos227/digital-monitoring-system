import { defineEventHandler, getQuery } from 'h3'
import type { RankSuggestionApiResponse } from '../../shared/responses'
import { PERSONNEL_PERMISSION_GROUPS } from '../../shared/constants'
import type { RankSuggestionRow } from '../../shared/models'
import { mapRankSuggestionItem, parseRankSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchRankSuggestions } from '../../utils/ranks/fetchRankSuggestions'

export default defineEventHandler(async (event): Promise<RankSuggestionApiResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)

  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseRankSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
  })

  const supabase = getServiceSupabaseClient()
  const rows: RankSuggestionRow[] = await fetchRankSuggestions(supabase, term, pageSize, selectedId)

  return { items: rows.map(mapRankSuggestionItem) }
})
