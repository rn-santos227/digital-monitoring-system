import { defineEventHandler, getQuery } from 'h3'
import type { TrainingSuggestionsResponse } from '../../shared/responses'
import { TRAINING_PERMISSION_GROUPS } from '../../shared/constants'
import { mapTrainingSuggestionItem, parseTrainingSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchTrainingSuggestions } from '../../utils/trainings/fetchTrainingSuggestions'
import { getTrainingSuggestionById } from '../../utils/trainings/getTrainingSuggestionById'

export default defineEventHandler(async (event): Promise<TrainingSuggestionsResponse> => {
  await requireAnyPermission(event, TRAINING_PERMISSION_GROUPS.trainingManagement)
  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseTrainingSuggestionQuery({ term: query.term, pageSize: query.pageSize, selectedId: query.selectedId })
  const supabase = getServiceSupabaseClient()
  const rows = await fetchTrainingSuggestions(supabase, pageSize, term)
  const mergedRows = [...rows]
  if (selectedId && !mergedRows.some((row) => row.id === selectedId)) {
    const selectedRow = await getTrainingSuggestionById(supabase, selectedId)
    if (selectedRow) mergedRows.unshift(selectedRow)
  }
  return { items: mergedRows.map(mapTrainingSuggestionItem) }
})
