import { defineEventHandler } from 'h3'
import {
  PERMISSION_CODES,
} from '../../shared/constants'
import type { DashboardCriticalPersonnelResponse } from '../../shared/responses'
import {
  buildPersonnelSummaryMetrics,
  normalizeDashboardPersonnelStatusRows,
} from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchPersonnelStatusAndActiveDeployments } from '../../utils/dashboard/fetchPersonnelStatusAndActiveDeployments'


export default defineEventHandler(async (event): Promise<DashboardCriticalPersonnelResponse> => {
  await requireAnyPermission(event, [
    PERMISSION_CODES.personnelView,
    PERMISSION_CODES.deploymentView,
  ])

  const supabase = getServiceSupabaseClient()
  const now = new Date()
  const todayIsoDate = now.toISOString().slice(0, 10)

  const { personnelRows, activeDeploymentRows } = await fetchPersonnelStatusAndActiveDeployments(
    supabase,
    todayIsoDate,
    'critical personnel',
  )

  const normalizedPersonnelRows = normalizeDashboardPersonnelStatusRows(personnelRows)
  const activeDeploymentLocationByPersonnelId = new Map(
    activeDeploymentRows.map((item) => ([
      item.personnel_id,
      item.location?.trim() || item.deployment_area?.trim() || 'Unknown Location',
    ]))
  )
  const metrics = buildPersonnelSummaryMetrics(normalizedPersonnelRows, activeDeploymentLocationByPersonnelId)

  return {
    asOf: now.toISOString(),
    items: metrics.criticalPersonnel,
  }
})
