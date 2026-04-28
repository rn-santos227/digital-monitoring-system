import { createError, defineEventHandler } from 'h3'
import { DASHBOARD_DEPLOYMENT_HISTORY_SELECT_COLUMNS, PERMISSION_CODES } from '../../shared/constants'
import type { DashboardDeploymentHistoryItem, DashboardPersonnelDeploymentHistoryResponse } from '../../shared/responses'
import { toFullName } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

interface DeploymentHistoryRow {
  created_at: string
  location: string | null
  deployment_area: string | null
  personnel_id: string
  deployment_statuses: { name: string } | { name: string }[] | null
  personnel: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null
}

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

  const deploymentHistoryResult = await supabase
    .from('deployment_records')
    .select(DASHBOARD_DEPLOYMENT_HISTORY_SELECT_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(DEPLOYMENT_HISTORY_LIMIT)

  if (deploymentHistoryResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load personnel deployment history: ${deploymentHistoryResult.error.message}` })
  }

  const rows = (deploymentHistoryResult.data ?? []) as DeploymentHistoryRow[]

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
