import { defineEventHandler } from 'h3'
import type { DashboardCriticalPersonnelResponse } from '../../shared/responses'
import {
  buildPersonnelSummaryMetrics,
  normalizeDashboardPersonnelStatusRows,
} from '../../shared/utils'
import { requireAuth } from '../../utils/auth/requireAuth'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchPersonnelStatusAndActiveDeployments } from '../../utils/dashboard/fetchPersonnelStatusAndActiveDeployments'


export default defineEventHandler(async (event): Promise<DashboardCriticalPersonnelResponse> => {
  await requireAuth(event)

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
