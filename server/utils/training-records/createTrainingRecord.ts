import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'

import type { TrainingRecordCreate } from '../../shared/models'

export async function createTrainingRecord(supabase: SupabaseClient, payload: TrainingRecordCreate): Promise<string> {
  const { data, error } = await supabase.from('training_records').insert(payload).select('id').maybeSingle<{ id: string }>()

  if (error || !data?.id) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create training record: ${error?.message ?? 'Missing id.'}`,
    })
  }

  return data.id
}
