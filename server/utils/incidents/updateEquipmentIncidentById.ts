import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { EquipmentIncidentUpdate } from '../../shared/models'

export const updateEquipmentIncidentById = async (
  supabase: SupabaseClient,
  id: string,
  updates: EquipmentIncidentUpdate,
): Promise<void> => {
  const { error } = await supabase
    .from('equipment_incidents')
    .update(updates)
    .eq('id', id)

  if (error) {
    throw createError({
      statusCode: error.code === '23505' ? 409 : 500,
      statusMessage: error.message,
    })
  }
}
