import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import { DashboardUnitManagementKpiResponse } from '../../shared/responses'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchUnitManagementCounts } from '../../utils/dashboard/fetchUnitManagementCounts'

export default defineEventHandler(async (event): Promise<DashboardUnitManagementKpiResponse> => {
  await requireAnyPermission(event, [
    PERMISSION_CODES.companyView,
    PERMISSION_CODES.battalionView,
    PERMISSION_CODES.personnelView,
  ])

  const supabase = getServiceSupabaseClient()
  return await fetchUnitManagementCounts(supabase)
})
