import { createError, defineEventHandler, getQuery } from 'h3'
import type { TrainingSuggestionsResponse } from '../../shared/responses'
import { TRAINING_PERMISSION_GROUPS, TRAINING_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import { mapTrainingSuggestionItem, parseTrainingSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_FIELDS = ['training_title', 'default_remarks'] as const

export default defineEventHandler(async (event): Promise<TrainingSuggestionsResponse> => {
  await requireAnyPermission(event, TRAINING_PERMISSION_GROUPS.trainingManagement)

  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseTrainingSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
  })

  const supabase = getServiceSupabaseClient()
  let trainingQuery = supabase
    .from('trainings')
    .select(TRAINING_SUGGESTION_SELECT_COLUMNS)
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('training_title', { ascending: true })
    .limit(pageSize)

  if (term.length > 0) {
    const filters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)

    if (filters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
    }

    trainingQuery = trainingQuery.or(filters.join(','))
  }

  const { data, error } = await trainingQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch training suggestions: ${error.message}` })
  }

  const mergedRows = [...(data ?? [])]

  if (selectedId && !mergedRows.some(row => row.id === selectedId)) {
    const { data: selectedRow, error: selectedError } = await supabase
      .from('trainings')
      .select(TRAINING_SUGGESTION_SELECT_COLUMNS)
      .eq('id', selectedId)
      .maybeSingle()

    if (selectedError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to fetch selected training: ${selectedError.message}` })
    }

    if (selectedRow) {
      mergedRows.unshift(selectedRow)
    }
  }

  return {
    items: mergedRows.map(mapTrainingSuggestionItem),
  }
})
