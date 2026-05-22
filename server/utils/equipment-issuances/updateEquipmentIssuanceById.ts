import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EquipmentIssuanceUpdate } from '../../shared/models'

export async function updateEquipmentIssuanceById(
  supabase: SupabaseClient,
  id: string,
  updates: EquipmentIssuanceUpdate,
) {
  const { error } = await supabase.from('equipment_issuances').update(updates).eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update equipment issuance: ${error.message}` })
  }
}
