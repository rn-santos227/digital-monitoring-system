import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { TrainingRecordUpdate } from '../../shared/models'

export async function updateTrainingRecordById(
  supabase: SupabaseClient,
  id: string,
  payload: TrainingRecordUpdate,
): Promise<void> {
  const { error } = await supabase.from('training_records').update(payload).eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update training record: ${error.message}` })
  }
}
