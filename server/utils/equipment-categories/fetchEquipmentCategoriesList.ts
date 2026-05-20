import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_CATEGORY_SELECT_COLUMNS } from '../../shared/constants'

interface FetchEquipmentCategoriesListOptions {
  search: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchEquipmentCategoriesList(supabase: SupabaseClient, options: FetchEquipmentCategoriesListOptions) {
  const { search, rangeFrom, rangeTo } = options

  let categoryQuery = supabase
    .from('equipment_categories')
    .select(EQUIPMENT_CATEGORY_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    categoryQuery = categoryQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
  }

  const { data, count, error } = await categoryQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch equipment categories: ${error.message}` })
  }

  return { rows: data ?? [], totalItems: count ?? 0 }
}
