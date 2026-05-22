import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteEquipmentIssuanceById(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('equipment_issuances').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to delete equipment issuance: ${error.message}` })
  }
}
