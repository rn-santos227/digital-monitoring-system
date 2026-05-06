import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { EngagementRecordUpdate } from '../../shared/models'

export async function updateEngagementRecordById(
  supabase: SupabaseClient,
  id: string,
  payload: EngagementRecordUpdate,
): Promise<void> {
  const { error } = await supabase.from('engagement_records').update(payload).eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update engagement record: ${error.message}` })
  }
}
