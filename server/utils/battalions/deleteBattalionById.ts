import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteBattalionById(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('battalions').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to delete battalion: ${error.message}` })
  }
}
