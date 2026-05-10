import { defineEventHandler } from 'h3'
import { DashboardUnitManagementKpiResponse } from '../../shared/responses'
import { requireAuth } from '../../utils/auth/requireAuth'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchUnitManagementCounts } from '../../utils/dashboard/fetchUnitManagementCounts'

export default defineEventHandler(async (event): Promise<DashboardUnitManagementKpiResponse> => {
  await requireAuth(event)

  const supabase = getServiceSupabaseClient()
  return await fetchUnitManagementCounts(supabase)
})
