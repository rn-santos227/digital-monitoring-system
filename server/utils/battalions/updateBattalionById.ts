import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function updateBattalionById(
  supabase: SupabaseClient,
  id: string,
  updates: Record<string, unknown>,
) {
  const { error } = await supabase.from('battalions').update(updates).eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update battalion: ${error.message}` })
  }
}
