import { createError, defineEventHandler } from 'h3'
import { DASHBOARD_NEAR_ROTATION_SELECT_COLUMNS, PERMISSION_CODES } from '../../shared/constants'
import type { DashboardNearRotationResponse, DashboardRotationAlertItem } from '../../shared/responses'
import { toFullName } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

interface NearRotationRow {
  personnel_id: string
  end_date: string
  location: string | null
  deployment_area: string | null
  personnel: { first_name: string; last_name: string } | { first_name: string; last_name: string }[] | null
}

const NEAR_ROTATION_WINDOW_DAYS = 14

export default defineEventHandler(async (event): Promise<DashboardNearRotationResponse> => {
  await requireAnyPermission(event, [
    PERMISSION_CODES.personnelView,
    PERMISSION_CODES.deploymentView,
  ])

  const supabase = getServiceSupabaseClient()
  const now = new Date()
  const todayIsoDate = now.toISOString().slice(0, 10)
  const cutoffDate = new Date(now.getTime() + (NEAR_ROTATION_WINDOW_DAYS * 86400000)).toISOString().slice(0, 10)

  const nearRotationResult = await supabase
    .from('deployment_records')
    .select(DASHBOARD_NEAR_ROTATION_SELECT_COLUMNS)
    .eq('deployment_statuses.name', 'Active')
    .not('end_date', 'is', null)
    .lte('end_date', cutoffDate)
    .gte('end_date', todayIsoDate)

  if (nearRotationResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load near-rotation records: ${nearRotationResult.error.message}` })
  }

  const rows = (nearRotationResult.data ?? []) as NearRotationRow[]

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
