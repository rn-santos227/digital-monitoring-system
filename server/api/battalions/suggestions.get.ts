import { createError, defineEventHandler, getQuery } from 'h3'
import type { BattalionSuggestionsResponse } from '../../shared/responses'
import { BATTALION_SUGGESTION_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapBattalionSuggestionItem, parseUnitSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

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
  let battalionQuery = supabase
    .from('battalions')
    .select(BATTALION_SUGGESTION_SELECT_COLUMNS)
    .eq('is_active', true)
    .order('name', { ascending: true })
    .limit(pageSize)

  if (term.length > 0) {
    const filters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)

    if (filters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
    }

    battalionQuery = battalionQuery.or(filters.join(','))
  }

  const { data, error } = await battalionQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalion suggestions: ${error.message}` })
  }

  const mergedRows = [...(data ?? [])]

  if (selectedId && !mergedRows.some(row => row.id === selectedId)) {
    const { data: selectedRow, error: selectedError } = await supabase
      .from('battalions')
      .select(BATTALION_SUGGESTION_SELECT_COLUMNS)
      .eq('id', selectedId)
      .maybeSingle()

    if (selectedError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to fetch selected battalion suggestion: ${selectedError.message}` })
    }

    if (selectedRow) {
      mergedRows.unshift(selectedRow)
    }
  }

  return {
    items: mergedRows.map(mapBattalionSuggestionItem),
  }
})
