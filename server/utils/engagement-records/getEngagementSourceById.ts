import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { EngagementRecordSourceRow } from '../../shared/models'

export async function getEngagementSourceById(
  supabase: SupabaseClient,
  engagementId: string,
): Promise<EngagementRecordSourceRow | null> {
  const { data, error } = await supabase
    .from('engagements')
    .select('id, engagement_title, engagement_type_id, level_id, start_date, end_date, status_id, default_remarks')
    .eq('id', engagementId)
    .maybeSingle<EngagementRecordSourceRow>()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read engagement source data: ${error.message}` })
  }

  return data
}
