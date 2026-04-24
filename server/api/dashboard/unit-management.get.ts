import { createError, defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

interface UnitManagementKpiResponse {
  totalCompanies: number
  totalBattalions: number
  totalUnassignedPersonnel: number
}

export default defineEventHandler(async (event): Promise<UnitManagementKpiResponse> => {
  await requireAnyPermission(event, [
    PERMISSION_CODES.companyView,
    PERMISSION_CODES.battalionView,
    PERMISSION_CODES.personnelView,
  ])

  const supabase = getServiceSupabaseClient()

  const [
    companiesResult,
    battalionsResult,
    unassignedPersonnelResult,
  ] = await Promise.all([
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
})
