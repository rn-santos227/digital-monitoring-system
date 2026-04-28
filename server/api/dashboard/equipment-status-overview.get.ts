import { createError, defineEventHandler } from 'h3'
import { DASHBOARD_EQUIPMENT_STATUS_SELECT_COLUMNS, PERMISSION_CODES } from '../../shared/constants'
import type { DashboardEquipmentStatusOverviewResponse } from '../../shared/responses'
import { buildEquipmentMetrics, type DashboardEquipmentStatusRow } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<DashboardEquipmentStatusOverviewResponse> => {
  await requireAnyPermission(event, [
    PERMISSION_CODES.equipmentView,
  ])

  const supabase = getServiceSupabaseClient()
  const now = new Date()

  const equipmentResult = await supabase
    .from('equipment_assets')
    .select(DASHBOARD_EQUIPMENT_STATUS_SELECT_COLUMNS)

  if (equipmentResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load equipment status overview: ${equipmentResult.error.message}` })
  }

  const equipmentRows = (equipmentResult.data ?? []) as DashboardEquipmentStatusRow[]
  const metrics = buildEquipmentMetrics(equipmentRows)

  return {
    asOf: now.toISOString(),
    summary: metrics.equipmentStatusOverview,
  }
})
