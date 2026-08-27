import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { DashboardCriticalEquipmentResponse } from '../../shared/responses'
import { buildEquipmentMetrics } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentAssets } from '../../utils/dashboard/fetchEquipmentAssets'

export default defineEventHandler(async (event): Promise<DashboardCriticalEquipmentResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)

  const supabase = getServiceSupabaseClient()
  const now = new Date()

  const equipmentRows = await fetchEquipmentAssets(supabase, 'critical equipment data')
  const metrics = buildEquipmentMetrics(equipmentRows)

  return {
    asOf: now.toISOString(),
    items: metrics.criticalEquipment,
  }
})
