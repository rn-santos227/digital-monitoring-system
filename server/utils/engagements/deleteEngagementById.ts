import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteEngagementById(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('engagements').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to delete engagement: ${error.message}` })
}
