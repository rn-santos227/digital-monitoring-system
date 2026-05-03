import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DeploymentUpdateDetail, DeploymentUpdateLocation } from '../../shared/models'

export async function updateDeploymentById(
  supabase: SupabaseClient,
  id: string,
  updates: DeploymentUpdateDetail | DeploymentUpdateLocation,
  context: string,
): Promise<void> {
  const { error } = await supabase.from('deployments').update(updates).eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update deployment ${context}: ${error.message}` })
  }
}
