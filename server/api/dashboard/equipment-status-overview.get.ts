import { defineEventHandler } from 'h3'
import type { DashboardEquipmentStatusOverviewResponse } from '../../shared/responses'
import { buildEquipmentMetrics } from '../../shared/utils'
import { requireAuth } from '../../utils/auth/requireAuth'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentAssets } from '../../utils/dashboard/fetchEquipmentAssets'

export default defineEventHandler(async (event): Promise<DashboardEquipmentStatusOverviewResponse> => {
  await requireAuth(event)

  const supabase = getServiceSupabaseClient()
  const now = new Date()

  const equipmentRows = await fetchEquipmentAssets(supabase, 'equipment status overview')
  const metrics = buildEquipmentMetrics(equipmentRows)

  return {
    asOf: now.toISOString(),
    summary: metrics.equipmentStatusOverview,
  }
})
