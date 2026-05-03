import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { DashboardDeploymentHistoryItem, DashboardPersonnelDeploymentHistoryResponse } from '../../shared/responses'
import { toFullName } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchDeploymentHistory, type DeploymentHistoryRow } from '../../utils/dashboard/fetchDeploymentHistory'

const DEPLOYMENT_HISTORY_LIMIT = 10

const toPerson = (value: DeploymentHistoryRow['personnel']): { first_name: string; last_name: string } | null => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export default defineEventHandler(async (event): Promise<DashboardPersonnelDeploymentHistoryResponse> => {
  await requireAnyPermission(event, [
    PERMISSION_CODES.personnelView,
    PERMISSION_CODES.deploymentView,
  ])

  const supabase = getServiceSupabaseClient()
  const now = new Date()

  const rows = await fetchDeploymentHistory(supabase, DEPLOYMENT_HISTORY_LIMIT)
  const items: DashboardDeploymentHistoryItem[] = rows.map((row) => {
    const person = toPerson(row.personnel)

    return {
      personnelId: row.personnel_id,
      fullName: toFullName(person?.first_name, person?.last_name),
      locationName: row.location?.trim() || row.deployment_area?.trim() || 'Unknown Location',
      statusName: Array.isArray(row.deployment_statuses)
        ? (row.deployment_statuses[0]?.name ?? 'Unknown Status')
        : (row.deployment_statuses?.name ?? 'Unknown Status'),
      loggedAt: row.created_at,
    }
  })

  return {
    asOf: now.toISOString(),
    items,
  }
})
