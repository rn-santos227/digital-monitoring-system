import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ENGAGEMENT_SELECT_COLUMNS } from '../../shared/constants'
import type { EngagementRow } from '../../shared/models'

export async function getEngagementById(supabase: SupabaseClient, id: string): Promise<EngagementRow | null> {
  const { data, error } = await supabase.from('engagements').select(ENGAGEMENT_SELECT_COLUMNS).eq('id', id).maybeSingle()
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to read engagement: ${error.message}` })
  return data as EngagementRow | null
}
