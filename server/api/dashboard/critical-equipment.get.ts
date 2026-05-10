import { defineEventHandler } from 'h3'
import type { DashboardCriticalEquipmentResponse } from '../../shared/responses'
import { buildEquipmentMetrics } from '../../shared/utils'
import { requireAuth } from '../../utils/auth/requireAuth'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentAssets } from '../../utils/dashboard/fetchEquipmentAssets'

export default defineEventHandler(async (event): Promise<DashboardCriticalEquipmentResponse> => {
  await requireAuth(event)

  const supabase = getServiceSupabaseClient()
  const now = new Date()

  const equipmentRows = await fetchEquipmentAssets(supabase, 'critical equipment data')
  const metrics = buildEquipmentMetrics(equipmentRows)

  return {
    asOf: now.toISOString(),
    items: metrics.criticalEquipment,
  }
})
