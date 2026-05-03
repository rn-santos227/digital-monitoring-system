import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteDeploymentRecordByRecordNo(supabase: SupabaseClient, recordNo: string): Promise<void> {
  const { error } = await supabase
    .from('deployment_records')
    .delete()
    .eq('record_no', recordNo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Deployment record rollback failed: ${error.message}` })
  }
}
