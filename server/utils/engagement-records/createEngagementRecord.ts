import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'

import type { EngagementRecordCreate } from '../../shared/models'

export async function createEngagementRecord(supabase: SupabaseClient, payload: EngagementRecordCreate): Promise<string> {
  const { data, error } = await supabase.from('engagement_records').insert(payload).select('id').maybeSingle<{ id: string }>()

  if (error || !data?.id) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create engagement record: ${error?.message ?? 'Missing id.'}`,
    })
  }

  return data.id
}
