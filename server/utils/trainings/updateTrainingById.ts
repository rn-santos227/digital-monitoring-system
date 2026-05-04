import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { TrainingUpdate } from '../../shared/models'

export async function updateTrainingById(supabase: SupabaseClient, id: string, updates: TrainingUpdate): Promise<void> {
  const { error } = await supabase.from('trainings').update(updates).eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to update training: ${error.message}` })
}
