import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_CATEGORY_SELECT_COLUMNS } from '../../shared/constants'

export async function searchEquipmentCategories(
  supabase: SupabaseClient,
  filters: string[],
  rangeFrom: number,
  rangeTo: number,
) {
  const { data, count, error } = await supabase
    .from('equipment_categories')
    .select(EQUIPMENT_CATEGORY_SELECT_COLUMNS, { count: 'exact' })
    .or(filters.join(','))
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search equipment categories: ${error.message}` })
  }

  return { rows: data ?? [], totalItems: count ?? 0 }
}
