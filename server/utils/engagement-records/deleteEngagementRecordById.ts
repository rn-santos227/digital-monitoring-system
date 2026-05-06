import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'

export async function deleteEngagementRecordById(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('engagement_records').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to delete engagement record: ${error.message}` })
  }
}
