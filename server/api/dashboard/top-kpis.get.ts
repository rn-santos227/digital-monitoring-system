import { createError, defineEventHandler } from 'h3'
import {
  DASHBOARD_ACTIVE_DEPLOYMENT_PERSONNEL_SELECT_COLUMNS,
  DASHBOARD_PERSONNEL_STATUS_SELECT_COLUMNS,
  PERMISSION_CODES,
} from '../../shared/constants'
import type { DashboardTopKpisResponse } from '../../shared/responses'
import {
  buildPersonnelSummaryMetrics,
  normalizeDashboardPersonnelStatusRows,
  type DashboardPersonnelStatusSourceRow,
} from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

interface ActiveDeploymentRow {
  personnel_id: string
}

export default defineEventHandler(async (event): Promise<DashboardTopKpisResponse> => {
  await requireAnyPermission(event, [
    PERMISSION_CODES.personnelView,
    PERMISSION_CODES.deploymentView,
  ])

  const supabase = getServiceSupabaseClient()
  const now = new Date()
  const todayIsoDate = now.toISOString().slice(0, 10)

  const [personnelResult, activeDeploymentsResult] = await Promise.all([
    supabase
      .from('vw_personnel_profile')
      .select(DASHBOARD_PERSONNEL_STATUS_SELECT_COLUMNS),
    supabase
      .from('deployment_records')
      .select(DASHBOARD_ACTIVE_DEPLOYMENT_PERSONNEL_SELECT_COLUMNS)
      .eq('deployment_statuses.name', 'Active')
      .or(`end_date.is.null,end_date.gte.${todayIsoDate}`),
  ])

  if (personnelResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load personnel KPI data: ${personnelResult.error.message}` })
  }

  if (activeDeploymentsResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load deployment KPI data: ${activeDeploymentsResult.error.message}` })
  }

  const personnelRows = normalizeDashboardPersonnelStatusRows(
    (personnelResult.data ?? []) as DashboardPersonnelStatusSourceRow[],
  )
  const activeDeploymentRows = (activeDeploymentsResult.data ?? []) as ActiveDeploymentRow[]
  const activeDeploymentLocationByPersonnelId = new Map(
    activeDeploymentRows.map((item) => ([
      item.personnel_id,
      '',
    ]))
  )
  const metrics = buildPersonnelSummaryMetrics(personnelRows, activeDeploymentLocationByPersonnelId)

  return {
    asOf: now.toISOString(),
    totalRegistered: metrics.totalRegistered,
    deployed: metrics.deployed,
    standbyAlert: metrics.standbyAlert,
    noComms: metrics.noComms,
    injuredOrDead: metrics.injuredOrDead,
  }
})
