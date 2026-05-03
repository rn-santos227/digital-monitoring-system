import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function fetchUnitManagementCounts(supabase: SupabaseClient) {
  const [companiesResult, battalionsResult, unassignedPersonnelResult] = await Promise.all([
    supabase.from('companies').select('id', { head: true, count: 'exact' }),
    supabase.from('battalions').select('id', { head: true, count: 'exact' }),
    supabase
      .from('personnel')
      .select('id', { head: true, count: 'exact' })
      .is('company_id', null),
  ])

  if (companiesResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to count companies: ${companiesResult.error.message}` })
  }

  if (battalionsResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to count battalions: ${battalionsResult.error.message}` })
  }

  if (unassignedPersonnelResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to count unassigned personnel: ${unassignedPersonnelResult.error.message}` })
  }

  return {
    totalCompanies: companiesResult.count ?? 0,
    totalBattalions: battalionsResult.count ?? 0,
    totalUnassignedPersonnel: unassignedPersonnelResult.count ?? 0,
  }
}
