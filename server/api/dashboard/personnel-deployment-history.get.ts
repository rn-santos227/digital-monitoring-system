import { defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type {
  DashboardDeploymentHistoryItem,
  DashboardPersonnelDeploymentHistoryResponse,
} from '../../shared/responses'
import { parseDashboardParameters } from '../../shared/validation'
import { firstRelatedItem, toFullName } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchDeploymentHistory } from '../../utils/dashboard/fetchDeploymentHistory'

export default defineEventHandler(async (event): Promise<DashboardPersonnelDeploymentHistoryResponse> => {
  await requirePermission(event, PERMISSION_CODES.personnelView)
  await requirePermission(event, PERMISSION_CODES.deploymentView)

  const supabase = getServiceSupabaseClient()
  const now = new Date()
  const parameters = parseDashboardParameters(getQuery(event))

  const rows = await fetchDeploymentHistory(supabase, parameters.itemLimit)
  const items: DashboardDeploymentHistoryItem[] = rows.map((row) => {
    const person = firstRelatedItem(row.personnel)

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
