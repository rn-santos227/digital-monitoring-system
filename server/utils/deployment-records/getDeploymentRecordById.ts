import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DeploymentRecordRow } from '../../shared/models'
import { DEPLOYMENT_RECORD_DETAIL_SELECT_COLUMNS } from '../../shared/constants'

export async function getDeploymentRecordById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('deployment_records')
    .select(DEPLOYMENT_RECORD_DETAIL_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle<DeploymentRecordRow>()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read deployment record: ${error.message}` })
  }

  return data
}
