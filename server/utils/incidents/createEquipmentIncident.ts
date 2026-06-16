import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { EquipmentIncidentCreate } from '../../shared/models'

export const createEquipmentIncident = async (
  supabase: SupabaseClient,
  payload: EquipmentIncidentCreate,
): Promise<string> => {
  const { data, error } = await supabase
    .from('equipment_incidents')
    .insert(payload)
    .select('id')
    .single()

  if (error || !data?.id) {
    throw createError({
      statusCode: error?.code === '23505' ? 409 : 500,
      statusMessage: error?.message ?? 'Failed to create equipment incident.',
    })
  }

  return data.id
}
