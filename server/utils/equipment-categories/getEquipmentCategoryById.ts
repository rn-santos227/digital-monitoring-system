import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_CATEGORY_SELECT_COLUMNS } from '../../shared/constants'

export async function getEquipmentCategoryById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('equipment_categories')
    .select(EQUIPMENT_CATEGORY_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read equipment category: ${error.message}` })
  }

  return data
}
