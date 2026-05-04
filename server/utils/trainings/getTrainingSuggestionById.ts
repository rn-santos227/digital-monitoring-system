import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { TRAINING_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { TrainingRow } from '../../shared/models'

export async function getTrainingSuggestionById(supabase: SupabaseClient, id: string): Promise<TrainingRow | null> {
  const { data, error } = await supabase.from('trainings').select(TRAINING_SUGGESTION_SELECT_COLUMNS).eq('id', id).maybeSingle()
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to read training suggestion: ${error.message}` })
  return data as TrainingRow | null
}
