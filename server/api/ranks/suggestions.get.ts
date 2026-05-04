import { defineEventHandler, getQuery } from 'h3'
import type { RankSuggestionApiResponse } from '../../shared/responses'
import { PERSONNEL_PERMISSION_GROUPS } from '../../shared/constants'
import type { RankSuggestionRow } from '../../shared/models'
import { mapRankSuggestionItem, parseRankSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchRankSuggestions } from '../../utils/ranks/fetchRankSuggestions'
import { getRankSuggestionById } from '../../utils/ranks/getRankSuggestionById'

export default defineEventHandler(async (event): Promise<RankSuggestionApiResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)

  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseRankSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
  })

  const supabase = getServiceSupabaseClient()
  const mergedRows: RankSuggestionRow[] = await fetchRankSuggestions(supabase, term, pageSize)

  if (selectedId && !mergedRows.some(row => row.id === selectedId)) {
    const selectedRow: RankSuggestionRow | null = await getRankSuggestionById(supabase, selectedId)

    if (selectedRow) {
      mergedRows.unshift(selectedRow)
    }
  }

  return {
    items: mergedRows.map(mapRankSuggestionItem),
  }
})
