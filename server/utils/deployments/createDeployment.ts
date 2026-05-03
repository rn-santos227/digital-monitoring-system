import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DeploymentCreate } from '../../shared/models'

export async function createDeployment(supabase: SupabaseClient, payload: DeploymentCreate): Promise<string> {
  const { data, error } = await supabase
    .from('deployments')
    .insert(payload)
    .select('id')
    .maybeSingle<{ id: string }>()

  if (error || !data?.id) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create deployment: ${error?.message ?? 'Missing id.'}` })
  }

  return data.id
}
