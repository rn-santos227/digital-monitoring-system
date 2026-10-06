import { defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { DashboardCriticalPersonnelResponse } from '../../shared/responses'
import { parseDashboardParameters } from '../../shared/validation'
import { buildPersonnelSummaryMetrics, normalizeDashboardPersonnelStatusRows } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import {
  fetchPersonnelStatusAndActiveDeployments,
} from '../../utils/dashboard/fetchPersonnelStatusAndActiveDeployments'

export default defineEventHandler(async (event): Promise<DashboardCriticalPersonnelResponse> => {
  await requirePermission(event, PERMISSION_CODES.personnelView)
  await requirePermission(event, PERMISSION_CODES.deploymentView)

  const supabase = getServiceSupabaseClient()
  const now = new Date()
  const todayIsoDate = now.toISOString().slice(0, 10)
  const parameters = parseDashboardParameters(getQuery(event))

  const { personnelRows, activeDeploymentRows } = await fetchPersonnelStatusAndActiveDeployments(
    supabase,
    todayIsoDate,
    'critical personnel',
    parameters.personnelLimit,
    parameters.deploymentLimit,
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
    items: metrics.criticalPersonnel.slice(0, parameters.itemLimit),
  }
})
