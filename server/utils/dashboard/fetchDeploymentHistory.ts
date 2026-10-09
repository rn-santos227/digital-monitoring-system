import type { DeploymentHistoryRow } from '../../shared/models'
import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DASHBOARD_DEPLOYMENT_HISTORY_SELECT_COLUMNS } from '../../shared/constants'

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
