import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteTrainingById(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('trainings').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to delete training: ${error.message}` })
}
