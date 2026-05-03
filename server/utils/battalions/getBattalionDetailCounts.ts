import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getBattalionDetailCounts(supabase: SupabaseClient, battalionId: string) {
  const [companiesResult, personnelResult, assetsResult] = await Promise.all([
    supabase.from('companies').select('id', { count: 'exact', head: true }).eq('battalion_id', battalionId),
    supabase.from('vw_personnel_profile').select('id', { count: 'exact', head: true }).eq('battalion_id', battalionId),
    supabase.from('equipment_assets').select('id', { count: 'exact', head: true }).eq('assigned_battalion_id', battalionId),
  ])

  if (companiesResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalion company count: ${companiesResult.error.message}` })
  }

  if (personnelResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalion personnel count: ${personnelResult.error.message}` })
  }

  if (assetsResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalion equipment asset count: ${assetsResult.error.message}` })
  }

  return {
    companyCount: companiesResult.count ?? 0,
    personnelCount: personnelResult.count ?? 0,
    equipmentAssetCount: assetsResult.count ?? 0,
  }
}
