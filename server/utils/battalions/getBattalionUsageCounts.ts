import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getBattalionUsageCounts(supabase: SupabaseClient, id: string): Promise<number> {
  const usageChecks = await Promise.all([
    supabase.from('companies').select('id', { count: 'exact', head: true }).eq('battalion_id', id),
    supabase.from('personnel').select('id', { count: 'exact', head: true }).eq('battalion_id', id),
    supabase.from('equipment_assets').select('id', { count: 'exact', head: true }).eq('assigned_battalion_id', id),
    supabase.from('employment_statuses').select('id', { count: 'exact', head: true }).eq('battalion_id', id),
  ])

  for (const result of usageChecks) {
    if (result.error) {
      throw createError({ statusCode: 500, statusMessage: `Failed to validate battalion usage: ${result.error.message}` })
    }
  }

  return usageChecks.reduce((total, result) => total + (result.count ?? 0), 0)
}
