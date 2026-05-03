import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

interface UpdateEffectiveSupervisorStatusParams {
  effectiveSupervisorId: string | null
  deployedServiceStatusId: string | null
}

export async function updateEffectiveSupervisorStatus(
  supabase: SupabaseClient,
  params: UpdateEffectiveSupervisorStatusParams,
): Promise<void> {
  if (!params.effectiveSupervisorId || !params.deployedServiceStatusId) {
    return
  }

  const { error } = await supabase
    .from('personnel')
    .update({ service_status_id: params.deployedServiceStatusId })
    .eq('id', params.effectiveSupervisorId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update supervisor service status: ${error.message}` })
  }
}
