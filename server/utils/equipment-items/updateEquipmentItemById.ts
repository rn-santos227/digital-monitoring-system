import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EquipmentItemUpdate } from '../../shared/models'

export async function updateEquipmentItemById(supabase: SupabaseClient, id: string, updates: EquipmentItemUpdate) {
  const { error } = await supabase.from('equipment_items').update(updates).eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update equipment item: ${error.message}` })
  }
}
