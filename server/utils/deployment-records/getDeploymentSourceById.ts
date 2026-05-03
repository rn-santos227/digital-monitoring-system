import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DeploymentRow } from '../../shared/models'
import { DEPLOYMENT_RECORD_DETAIL_SELECT_COLUMNS } from '../../shared/constants'

export async function getDeploymentSourceById(supabase: SupabaseClient, deploymentId: string): Promise<DeploymentRow | null> {
  const { data, error } = await supabase
    .from('deployments')
    .select(DEPLOYMENT_RECORD_DETAIL_SELECT_COLUMNS)
    .eq('id', deploymentId)
    .maybeSingle<DeploymentRow>()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read deployment source data: ${error.message}` })
  }

  return data
}
