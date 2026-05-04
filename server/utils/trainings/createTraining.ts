import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { TrainingCreate } from '../../shared/models'

export async function createTraining(supabase: SupabaseClient, payload: TrainingCreate): Promise<string> {
  const { data, error } = await supabase.from('trainings').insert(payload).select('id').maybeSingle<{ id: string }>()
  if (error || !data?.id) throw createError({ statusCode: 500, statusMessage: `Failed to create training: ${error?.message ?? 'Missing id.'}` })
  return data.id
}
