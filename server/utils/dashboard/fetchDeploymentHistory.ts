import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DASHBOARD_DEPLOYMENT_HISTORY_SELECT_COLUMNS } from '../../shared/constants'

interface DashboardPersonName {
  first_name: string
  last_name: string
}

interface DashboardDeploymentStatus {
  name: string
}

export interface DeploymentHistoryRow {
  created_at: string
  location: string | null
  deployment_area: string | null
  personnel_id: string
  deployment_statuses: DashboardDeploymentStatus | DashboardDeploymentStatus[] | null
  personnel: DashboardPersonName | DashboardPersonName[] | null
}

export async function fetchDeploymentHistory(supabase: SupabaseClient, limit: number) {
  const deploymentHistoryResult = await supabase
    .from('deployment_records')
    .select(DASHBOARD_DEPLOYMENT_HISTORY_SELECT_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (deploymentHistoryResult.error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to load personnel deployment history: ${deploymentHistoryResult.error.message}` })
  }

  return (deploymentHistoryResult.data ?? []) as DeploymentHistoryRow[]
}
