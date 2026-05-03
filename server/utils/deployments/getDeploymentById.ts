import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { DEPLOYMENT_DETAIL_SELECT_COLUMNS } from '../../shared/constants'
import type { DeploymentRow } from '../../shared/models'

export async function getDeploymentById(supabase: SupabaseClient, id: string): Promise<DeploymentRow | null> {
  const { data, error } = await supabase
    .from('deployments')
    .select(DEPLOYMENT_DETAIL_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read deployment: ${error.message}` })
  }

  return (data as DeploymentRow | null)
}
