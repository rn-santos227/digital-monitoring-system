import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { DashboardOperationalTimeMonitoringResponse } from '../../shared/responses'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchOperationalTimeDeployments } from '../../utils/dashboard/fetchOperationalTimeDeployments'

interface OperationalTimeRow {
  start_date: string
  end_date: string | null
}

const DAY_IN_MILLISECONDS = 86400000

export default defineEventHandler(async (event): Promise<DashboardOperationalTimeMonitoringResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentView)

  const supabase = getServiceSupabaseClient()
  const now = new Date()
  const todayIsoDate = now.toISOString().slice(0, 10)

  const rows = await fetchOperationalTimeDeployments(supabase, todayIsoDate)

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
