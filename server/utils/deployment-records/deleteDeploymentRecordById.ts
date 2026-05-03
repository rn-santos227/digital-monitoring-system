import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteDeploymentRecordById(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('deployment_records').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to delete deployment record: ${error.message}` })
  }
}
