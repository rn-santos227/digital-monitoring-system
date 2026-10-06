import { defineEventHandler, getQuery } from 'h3'
import { DASHBOARD_MILLISECONDS_PER_DAY, NEAR_ROTATION_WINDOW_DAYS, PERMISSION_CODES } from '../../shared/constants'
import type { DashboardNearRotationResponse, DashboardRotationAlertItem } from '../../shared/responses'
import { parseDashboardParameters } from '../../shared/validation'
import { firstRelatedItem, toFullName } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchNearRotationDeployments } from '../../utils/dashboard/fetchNearRotationDeployments'

export default defineEventHandler(async (event): Promise<DashboardNearRotationResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentView)

  const supabase = getServiceSupabaseClient()
  const now = new Date()
  const todayIsoDate = now.toISOString().slice(0, 10)
  const cutoffDate = new Date(now.getTime() + (NEAR_ROTATION_WINDOW_DAYS * DASHBOARD_MILLISECONDS_PER_DAY)).toISOString().slice(0, 10)
  const parameters = parseDashboardParameters(getQuery(event))

  const rows = await fetchNearRotationDeployments(supabase, todayIsoDate, cutoffDate, parameters.itemLimit)

  const items: DashboardRotationAlertItem[] = rows.map((row) => {
    const person = firstRelatedItem(row.personnel)
    const endDate = new Date(row.end_date)
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / DASHBOARD_MILLISECONDS_PER_DAY))

    return {
      personnelId: row.personnel_id,
      fullName: toFullName(person?.first_name, person?.last_name),
      locationName: row.location?.trim() || row.deployment_area?.trim() || 'Unknown Location',
      endDate: row.end_date,
      daysRemaining,
    }
  })

  return {
    asOf: now.toISOString(),
    items,
  }
})
