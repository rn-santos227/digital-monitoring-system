import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { TrainingRecordSourceRow } from '../../shared/models'

export async function getTrainingSourceById(
  supabase: SupabaseClient,
  trainingId: string,
): Promise<TrainingRecordSourceRow | null> {
  const { data, error } = await supabase
    .from('trainings')
    .select('id, training_title, training_category_id, level_id, start_date, end_date, status_id, default_remarks')
    .eq('id', trainingId)
    .maybeSingle<TrainingRecordSourceRow>()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read training source data: ${error.message}` })
  }

  return data
}
