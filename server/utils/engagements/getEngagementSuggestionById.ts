import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ENGAGEMENT_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { EngagementRow } from '../../shared/models'

export async function getEngagementSuggestionById(supabase: SupabaseClient, id: string): Promise<EngagementRow | null> {
  const { data, error } = await supabase.from('engagements').select(ENGAGEMENT_SUGGESTION_SELECT_COLUMNS).eq('id', id).maybeSingle()
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to read engagement suggestion: ${error.message}` })
  return data as EngagementRow | null
}
