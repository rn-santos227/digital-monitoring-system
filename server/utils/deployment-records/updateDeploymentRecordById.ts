import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DeploymentRecordUpdate } from '../../shared/models'

export async function updateDeploymentRecordById(supabase: SupabaseClient, id: string, payload: DeploymentRecordUpdate) {
  const { error } = await supabase.from('deployment_records').update(payload).eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update deployment record: ${error.message}` })
  }
}
