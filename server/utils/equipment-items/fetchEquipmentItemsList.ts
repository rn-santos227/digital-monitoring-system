import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ITEM_SELECT_COLUMNS } from '../../shared/constants'

interface FetchEquipmentItemsListOptions {
  search: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchEquipmentItemsList(supabase: SupabaseClient, options: FetchEquipmentItemsListOptions) {
  const { search, rangeFrom, rangeTo } = options

  let equipmentItemQuery = supabase
    .from('equipment_items')
    .select(EQUIPMENT_ITEM_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    equipmentItemQuery = equipmentItemQuery.or(`equipment_code.ilike.%${search}%,name.ilike.%${search}%,model.ilike.%${search}%,manufacturer.ilike.%${search}%`)
  }

  const { data, count, error } = await equipmentItemQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch equipment items: ${error.message}` })
  }

  return { rows: data ?? [], totalItems: count ?? 0 }
}
