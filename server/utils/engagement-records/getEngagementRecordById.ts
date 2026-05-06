import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { EngagementRecordRow } from '../../shared/models'
import { ENGAGEMENT_RECORD_DETAIL_SELECT_COLUMNS } from '../../shared/constants'

export async function getEngagementRecordById(supabase: SupabaseClient, id: string): Promise<EngagementRecordRow | null> {
  const { data, error } = await supabase
    .from('engagement_records')
    .select(ENGAGEMENT_RECORD_DETAIL_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle<EngagementRecordRow>()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read engagement record: ${error.message}` })
  }

  return data
}
