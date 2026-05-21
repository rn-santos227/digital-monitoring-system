import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function deleteEquipmentItemById(supabase: SupabaseClient, id: string) {
  const { error } = await supabase.from('equipment_items').delete().eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to delete equipment item: ${error.message}` })
  }
}
