import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  DASHBOARD_ACTIVE_DEPLOYMENT_PERSONNEL_SELECT_COLUMNS,
  DASHBOARD_PERSONNEL_STATUS_SELECT_COLUMNS,
} from '../../shared/constants'
import type { DashboardPersonnelStatusSourceRow } from '../../shared/utils'

interface ActiveDeploymentRow {
  personnel_id: string
  location: string | null
  deployment_area: string | null
}

export async function fetchPersonnelStatusAndActiveDeployments(
  supabase: SupabaseClient,
  todayIsoDate: string,
  contextLabel: string,
) {
  const [personnelResult, activeDeploymentsResult] = await Promise.all([
    supabase
      .from('vw_personnel_profile')
      .select(DASHBOARD_PERSONNEL_STATUS_SELECT_COLUMNS),
    supabase
      .from('deployment_records')
      .select(DASHBOARD_ACTIVE_DEPLOYMENT_PERSONNEL_SELECT_COLUMNS)
      .eq('deployment_statuses.name', 'Active')
      .or(`end_date.is.null,end_date.gte.${todayIsoDate}`),
  ])

  if (personnelResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load ${contextLabel} personnel data: ${personnelResult.error.message}` })
  }

  if (activeDeploymentsResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load ${contextLabel} deployment data: ${activeDeploymentsResult.error.message}` })
  }

  return {
    personnelRows: (personnelResult.data ?? []) as DashboardPersonnelStatusSourceRow[],
    activeDeploymentRows: (activeDeploymentsResult.data ?? []) as ActiveDeploymentRow[],
  }
}
