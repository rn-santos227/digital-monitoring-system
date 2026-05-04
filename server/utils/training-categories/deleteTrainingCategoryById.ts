import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteTrainingCategoryById(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('training_categories').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to delete training category: ${error.message}` })
  }
}
