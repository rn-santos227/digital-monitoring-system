import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getCompanyUsageCounts(supabase: SupabaseClient, id: string) {
  const [personnelResult, assetsResult] = await Promise.all([
    supabase.from('personnel').select('id', { count: 'exact', head: true }).eq('company_id', id),
    supabase.from('equipment_assets').select('id', { count: 'exact', head: true }).eq('assigned_company_id', id),
  ])

  if (personnelResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch company personnel count: ${personnelResult.error.message}` })
  }

  if (assetsResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch company equipment asset count: ${assetsResult.error.message}` })
  }

  return {
    personnelCount: personnelResult.count ?? 0,
    equipmentAssetCount: assetsResult.count ?? 0,
  }
}
