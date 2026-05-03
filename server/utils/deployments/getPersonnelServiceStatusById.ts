import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

interface PersonnelServiceStatusRow {
  service_status_id: string | null
}

export const getPersonnelServiceStatusById = async (
  supabase: SupabaseClient,
  personnelId: string,
  errorPrefix: string,
): Promise<string | null> => {
  const { data, error } = await supabase
    .from('personnel')
    .select('service_status_id')
    .eq('id', personnelId)
    .maybeSingle<PersonnelServiceStatusRow>()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `${errorPrefix}: ${error.message}`,
    })
  }

  return data?.service_status_id ?? null
}
