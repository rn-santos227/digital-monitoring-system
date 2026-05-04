import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getTrainingUsageCountById(supabase: SupabaseClient, id: string): Promise<number> {
  const { count, error } = await supabase.from('training_records').select('id', { count: 'exact', head: true }).eq('training_id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to validate training usage: ${error.message}` })
  return count ?? 0
}
