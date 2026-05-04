import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { TrainingCategoryUpdate } from '../../shared/models'

export async function updateTrainingCategoryById(supabase: SupabaseClient, id: string, updates: TrainingCategoryUpdate) {
  const { error } = await supabase.from('training_categories').update(updates).eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update training category: ${error.message}` })
  }
}
