import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { TRAINING_CATEGORY_SELECT_COLUMNS } from '../../shared/constants'

export async function getTrainingCategoryById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('training_categories')
    .select(TRAINING_CATEGORY_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read training category: ${error.message}` })
  }

  return data
}
