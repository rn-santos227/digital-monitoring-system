import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { TrainingRecordRow } from '../../shared/models'
import { TRAINING_RECORD_SELECT_COLUMNS } from '../../shared/constants'

export async function getTrainingRecordById(supabase: SupabaseClient, id: string): Promise<TrainingRecordRow | null> {
  const { data, error } = await supabase
    .from('training_records')
    .select(TRAINING_RECORD_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle<TrainingRecordRow>()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read training record: ${error.message}` })
  }

  return data
}
