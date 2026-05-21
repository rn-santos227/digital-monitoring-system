import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ITEM_SELECT_COLUMNS } from '../../shared/constants'

export async function getEquipmentItemById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('equipment_items')
    .select(EQUIPMENT_ITEM_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read equipment item: ${error.message}` })
  }

  return data
}
