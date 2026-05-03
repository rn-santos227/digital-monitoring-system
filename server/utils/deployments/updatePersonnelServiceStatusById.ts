import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export const updatePersonnelServiceStatusById = async (
  supabase: SupabaseClient,
  personnelId: string,
  serviceStatusId: string | null,
  errorPrefix: string,
): Promise<void> => {
  const { error } = await supabase
    .from('personnel')
    .update({ service_status_id: serviceStatusId })
    .eq('id', personnelId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `${errorPrefix}: ${error.message}` })
  }
}
