import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getEngagementUsageCountById(supabase: SupabaseClient, id: string): Promise<number> {
  const { count, error } = await supabase.from('engagement_records').select('id', { count: 'exact', head: true }).eq('engagement_id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to validate engagement usage: ${error.message}` })
  return count ?? 0
}
