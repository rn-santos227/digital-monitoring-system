import { createError, defineEventHandler } from 'h3'
import {
  DASHBOARD_ACTIVE_DEPLOYMENT_PERSONNEL_SELECT_COLUMNS,
  DASHBOARD_PERSONNEL_STATUS_SELECT_COLUMNS,
  PERMISSION_CODES,
} from '../../shared/constants'
import type { DashboardLocationLoadAnalysisResponse } from '../../shared/responses'
import { buildPersonnelSummaryMetrics, type DashboardPersonnelStatusRow } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

interface ActiveDeploymentRow {
  personnel_id: string
}

export default defineEventHandler(async (event): Promise<DashboardLocationLoadAnalysisResponse> => {
  await requireAnyPermission(event, [
    PERMISSION_CODES.personnelView,
    PERMISSION_CODES.deploymentView,
    PERMISSION_CODES.battalionView,
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
    throw createError({ statusCode: 500, statusMessage: `Failed to load location analysis personnel data: ${personnelResult.error.message}` })
  }

  if (activeDeploymentsResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load location analysis deployment data: ${activeDeploymentsResult.error.message}` })
  }

  const personnelRows = (personnelResult.data ?? []) as DashboardPersonnelStatusRow[]
  const activeDeploymentRows = (activeDeploymentsResult.data ?? []) as ActiveDeploymentRow[]
  const activeDeploymentPersonnelIds = new Set(activeDeploymentRows.map((item) => item.personnel_id))
  const metrics = buildPersonnelSummaryMetrics(personnelRows, activeDeploymentPersonnelIds)

  return {
    asOf: now.toISOString(),
    items: metrics.locationLoadAnalysis,
  }
})
