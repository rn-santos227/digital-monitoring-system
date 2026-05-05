import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EngagementUpdate } from '../../shared/models'

export async function updateEngagementById(supabase: SupabaseClient, id: string, updates: EngagementUpdate): Promise<void> {
  const { error } = await supabase.from('engagements').update(updates).eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to update engagement: ${error.message}` })
}
