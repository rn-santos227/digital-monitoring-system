import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { DashboardUnitManagementKpiResponse } from '../../shared/responses'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchUnitManagementCounts } from '../../utils/dashboard/fetchUnitManagementCounts'

export default defineEventHandler(async (event): Promise<DashboardUnitManagementKpiResponse> => {
  await requirePermission(event, PERMISSION_CODES.battalionView)
  await requirePermission(event, PERMISSION_CODES.companyView)

  const supabase = getServiceSupabaseClient()
  return await fetchUnitManagementCounts(supabase)
})
