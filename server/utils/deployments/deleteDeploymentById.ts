import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteDeploymentById(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('deployments').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to delete deployment: ${error.message}` })
  }
}
