import type { NearRotationDeploymentRow } from '../../shared/models'
import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DASHBOARD_NEAR_ROTATION_SELECT_COLUMNS } from '../../shared/constants'

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
