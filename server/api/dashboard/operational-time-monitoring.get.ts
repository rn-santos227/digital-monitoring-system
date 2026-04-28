import { createError, defineEventHandler } from 'h3'
import { DASHBOARD_OPERATIONAL_TIME_MONITORING_SELECT_COLUMNS, PERMISSION_CODES } from '../../shared/constants'
import type { DashboardOperationalTimeMonitoringResponse } from '../../shared/responses'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

interface OperationalTimeRow {
  start_date: string
  end_date: string | null
}

const DAY_IN_MILLISECONDS = 86400000

export default defineEventHandler(async (event): Promise<DashboardOperationalTimeMonitoringResponse> => {
  await requireAnyPermission(event, [
    PERMISSION_CODES.personnelView,
    PERMISSION_CODES.deploymentView,
  ])

  const supabase = getServiceSupabaseClient()
  const now = new Date()
  const todayIsoDate = now.toISOString().slice(0, 10)

  const operationalTimeResult = await supabase
    .from('deployment_records')
    .select(DASHBOARD_OPERATIONAL_TIME_MONITORING_SELECT_COLUMNS)
    .eq('deployment_statuses.name', 'Active')
    .or(`end_date.is.null,end_date.gte.${todayIsoDate}`)

  if (operationalTimeResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load operational time monitoring metrics: ${operationalTimeResult.error.message}` })
  }

  const rows = (operationalTimeResult.data ?? []) as OperationalTimeRow[]

  let totalActiveDays = 0
  let longestActiveDays = 0

  for (const row of rows) {
    const startDate = new Date(row.start_date)
    const activeDays = Math.max(0, Math.ceil((now.getTime() - startDate.getTime()) / DAY_IN_MILLISECONDS))

    totalActiveDays += activeDays
    longestActiveDays = Math.max(longestActiveDays, activeDays)
  }

  const activeDeploymentCount = rows.length
  const averageActiveDays = activeDeploymentCount > 0
    ? Math.round(totalActiveDays / activeDeploymentCount)
    : 0

  return {
    asOf: now.toISOString(),
    metric: {
      activeDeploymentCount,
      averageActiveDays,
      longestActiveDays,
    },
  }
})
