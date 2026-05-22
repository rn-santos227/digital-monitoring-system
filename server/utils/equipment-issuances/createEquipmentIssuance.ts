import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EquipmentIssuanceCreate } from '../../shared/models'

export async function createEquipmentIssuance(supabase: SupabaseClient, payload: EquipmentIssuanceCreate) {
  const { data, error } = await supabase.from('equipment_issuances').insert(payload).select('id').single()

  if (error || !data) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create equipment issuance: ${error?.message ?? 'Unknown error'}` })
  }

  return data.id
}
