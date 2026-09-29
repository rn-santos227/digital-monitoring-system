import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DASHBOARD_NEAR_ROTATION_SELECT_COLUMNS } from '../../shared/constants'

interface DashboardPersonName {
  first_name: string
  last_name: string
}

export interface NearRotationDeploymentRow {
  personnel_id: string
  end_date: string
  location: string | null
  deployment_area: string | null
  personnel: DashboardPersonName | DashboardPersonName[] | null
}

export async function fetchNearRotationDeployments(
  supabase: SupabaseClient,
  todayIsoDate: string,
  cutoffDate: string,
  limit: number,
) {
  const nearRotationResult = await supabase
    .from('deployment_records')
    .select(DASHBOARD_NEAR_ROTATION_SELECT_COLUMNS)
    .eq('deployment_statuses.name', 'Active')
    .not('end_date', 'is', null)
    .lte('end_date', cutoffDate)
    .gte('end_date', todayIsoDate)
    .order('end_date', { ascending: true })
    .limit(limit)

  if (nearRotationResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load near-rotation records: ${nearRotationResult.error.message}` })
  }

  return (nearRotationResult.data ?? []) as NearRotationDeploymentRow[]
}
