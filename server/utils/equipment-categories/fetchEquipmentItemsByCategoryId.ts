import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ITEM_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentItemRow } from '../../shared/models'

interface FetchEquipmentItemsByCategoryIdOptions {
  categoryId: string
  search: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchEquipmentItemsByCategoryId(
  supabase: SupabaseClient,
  options: FetchEquipmentItemsByCategoryIdOptions,
) {
  const { categoryId, search, rangeFrom, rangeTo } = options

  let equipmentItemQuery = supabase
    .from('equipment_items')
    .select<string, EquipmentItemRow>(EQUIPMENT_ITEM_SELECT_COLUMNS, { count: 'exact' })
    .eq('category_id', categoryId)
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    equipmentItemQuery = equipmentItemQuery.or(
      `equipment_code.ilike.%${search}%,name.ilike.%${search}%,model.ilike.%${search}%,manufacturer.ilike.%${search}%`,
    )
  }

  const { data, count, error } = await equipmentItemQuery

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch equipment items by category: ${error.message}`,
    })
  }

  return { rows: data ?? [], totalItems: count ?? 0 }
}
