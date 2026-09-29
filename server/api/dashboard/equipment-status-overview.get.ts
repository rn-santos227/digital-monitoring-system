import { defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { DashboardEquipmentStatusOverviewResponse } from '../../shared/responses'
import { parseDashboardParameters } from '../../shared/validations'
import { buildEquipmentMetrics } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchEquipmentAssets } from '../../utils/dashboard/fetchEquipmentAssets'

export default defineEventHandler(async (event): Promise<DashboardEquipmentStatusOverviewResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)

  const supabase = getServiceSupabaseClient()
  const now = new Date()
  const parameters = parseDashboardParameters(getQuery(event))

  const equipmentRows = await fetchEquipmentAssets(supabase, 'equipment status overview')
  const metrics = buildEquipmentMetrics(equipmentRows)

  return {
    asOf: now.toISOString(),
    summary: metrics.equipmentStatusOverview,
  }
})
