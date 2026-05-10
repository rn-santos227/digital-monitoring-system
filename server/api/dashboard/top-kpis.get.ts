import { defineEventHandler } from 'h3'
import type { DashboardTopKpisResponse } from '../../shared/responses'
import {
  buildPersonnelSummaryMetrics,
  normalizeDashboardPersonnelStatusRows,
} from '../../shared/utils'
import { requireAuth } from '../../utils/auth/requireAuth'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchPersonnelStatusAndActiveDeployments } from '../../utils/dashboard/fetchPersonnelStatusAndActiveDeployments'

export default defineEventHandler(async (event): Promise<DashboardTopKpisResponse> => {
  await requireAuth(event)

  const supabase = getServiceSupabaseClient()
  const now = new Date()
  const todayIsoDate = now.toISOString().slice(0, 10)

  const { personnelRows, activeDeploymentRows } = await fetchPersonnelStatusAndActiveDeployments(
    supabase,
    todayIsoDate,
    'personnel',
  )

  const normalizedPersonnelRows = normalizeDashboardPersonnelStatusRows(personnelRows)
  const activeDeploymentLocationByPersonnelId = new Map(
    activeDeploymentRows.map((item) => ([
      item.personnel_id,
      '',
    ]))
  )

  const metrics = buildPersonnelSummaryMetrics(normalizedPersonnelRows, activeDeploymentLocationByPersonnelId)
  return {
    asOf: now.toISOString(),
    totalRegistered: metrics.totalRegistered,
    deployed: metrics.deployed,
    standbyAlert: metrics.standbyAlert,
    noComms: metrics.noComms,
    injuredOrDead: metrics.injuredOrDead,
  }
})
