import { createError, defineEventHandler, getQuery } from 'h3'
import type { RankSuggestionApiResponse } from '../../shared/responses'
import { PERSONNEL_PERMISSION_GROUPS, RANK_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import { mapRankSuggestionItem, parseRankSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_FIELDS = ['code', 'name'] as const

export default defineEventHandler(async (event): Promise<RankSuggestionApiResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)

  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseRankSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
  })

  const supabase = getServiceSupabaseClient()
  let rankQuery = supabase
    .from('ranks')
    .select(RANK_SUGGESTION_SELECT_COLUMNS)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .limit(pageSize)

  if (term.length > 0) {
    const filters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)

    if (filters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
    }

    rankQuery = rankQuery.or(filters.join(','))
  }

  const { data, error } = await rankQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch rank suggestions: ${error.message}` })
  }

  const mergedRows = [...(data ?? [])]

  if (selectedId && !mergedRows.some(row => row.id === selectedId)) {
    const { data: selectedRow, error: selectedError } = await supabase
      .from('ranks')
      .select(RANK_SUGGESTION_SELECT_COLUMNS)
      .eq('id', selectedId)
      .maybeSingle()

    if (selectedError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to fetch selected rank suggestion: ${selectedError.message}` })
    }

    if (selectedRow) {
      mergedRows.unshift(selectedRow)
    }
  }

  return {
    items: mergedRows.map(mapRankSuggestionItem),
  }
})
