import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { TRAINING_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { TrainingRow } from '../../shared/models'

export async function fetchTrainingSuggestions(supabase: SupabaseClient, pageSize: number, term: string) {
  let query = supabase
    .from('trainings')
    .select(TRAINING_SUGGESTION_SELECT_COLUMNS)
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('training_title', { ascending: true })
    .limit(pageSize)

  if (term.length > 0) {
    query = query.or(`training_title.ilike.%${term}%,default_remarks.ilike.%${term}%`)
  }

  const { data, error } = await query
  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch training suggestions: ${error.message}` })
  }

  return (data ?? []) as TrainingRow[]
}
