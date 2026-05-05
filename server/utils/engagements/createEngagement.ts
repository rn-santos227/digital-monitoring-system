import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EngagementCreate } from '../../shared/models'

export async function createEngagement(supabase: SupabaseClient, payload: EngagementCreate): Promise<string> {
  const { data, error } = await supabase.from('engagements').insert(payload).select('id').maybeSingle<{ id: string }>()
  if (error || !data?.id) throw createError({ statusCode: 500, statusMessage: `Failed to create engagement: ${error?.message ?? 'Missing id.'}` })
  return data.id
}
