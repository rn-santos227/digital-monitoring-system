import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DeploymentRecordCreate } from '../../shared/models'

export async function createDeploymentRecord(supabase: SupabaseClient, payload: DeploymentRecordCreate) {
  const { data, error } = await supabase
    .from('deployment_records')
    .insert(payload)
    .select('id')
    .maybeSingle<{ id: string }>()

  if (error || !data?.id) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create deployment record: ${error?.message ?? 'Missing id.'}`,
    })
  }

  return data.id
}
