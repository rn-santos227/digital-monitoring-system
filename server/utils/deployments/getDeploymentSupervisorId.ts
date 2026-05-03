import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function getDeploymentSupervisorId(supabase: SupabaseClient, supervisorId: unknown): Promise<string | null> {
  if (typeof supervisorId !== 'string') {
    return null
  }

  const normalizedSupervisorId = supervisorId.trim()
  if (!normalizedSupervisorId) {
    return null
  }

  const { data, error } = await supabase
    .from('personnel')
    .select('id')
    .eq('id', normalizedSupervisorId)
    .maybeSingle<{ id: string }>()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read supervisor personnel: ${error.message}` })
  }

  if (!data?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Supervisor personnel not found.' })
  }

  return data.id
}
