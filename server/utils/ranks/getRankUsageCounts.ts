import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getRankUsageCounts(supabase: SupabaseClient, rankId: string): Promise<{ personnelCount: number }> {
  const { count, error } = await supabase
    .from('personnel')
    .select('id', { count: 'exact', head: true })
    .eq('rank_id', rankId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to validate rank usage: ${error.message}` })
  }

  return { personnelCount: count ?? 0 }
}
