import { defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { DashboardNearRotationResponse, DashboardRotationAlertItem } from '../../shared/responses'
import { parseDashboardParameters } from '../../shared/validations'
import { toFullName } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchNearRotationDeployments } from '../../utils/dashboard/fetchNearRotationDeployments'

interface NearRotationRow {
  personnel_id: string
  end_date: string
  location: string | null
  deployment_area: string | null
  personnel: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null
}

const NEAR_ROTATION_WINDOW_DAYS = 14

export default defineEventHandler(async (event): Promise<DashboardNearRotationResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentView)

  const supabase = getServiceSupabaseClient()
  const now = new Date()
  const todayIsoDate = now.toISOString().slice(0, 10)
  const cutoffDate = new Date(now.getTime() + (NEAR_ROTATION_WINDOW_DAYS * 86400000)).toISOString().slice(0, 10)
  const parameters = parseDashboardParameters(getQuery(event))

  const rows = await fetchNearRotationDeployments(supabase, todayIsoDate, cutoffDate)

  const items: DashboardRotationAlertItem[] = rows.map((row) => {
    const person = Array.isArray(row.personnel) ? (row.personnel[0] ?? null) : row.personnel
    const endDate = new Date(row.end_date)
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / 86400000))

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
