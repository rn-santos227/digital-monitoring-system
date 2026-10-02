import { defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { DashboardDeploymentHistoryItem, DashboardPersonnelDeploymentHistoryResponse } from '../../shared/responses'
import { parseDashboardParameters } from '../../shared/validations'
import { toFullName } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchDeploymentHistory, type DeploymentHistoryRow } from '../../utils/dashboard/fetchDeploymentHistory'

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
  await requirePermission(event, PERMISSION_CODES.personnelView)
  await requirePermission(event, PERMISSION_CODES.deploymentView)

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
