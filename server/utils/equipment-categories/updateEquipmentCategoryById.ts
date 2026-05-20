import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EquipmentCategoryUpdate } from '../../shared/models'

export async function updateEquipmentCategoryById(supabase: SupabaseClient, id: string, updates: EquipmentCategoryUpdate) {
  const { error } = await supabase.from('equipment_categories').update(updates).eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update equipment category: ${error.message}` })
  }
}
