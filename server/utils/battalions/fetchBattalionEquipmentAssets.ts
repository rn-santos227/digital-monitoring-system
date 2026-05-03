import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { UNIT_EQUIPMENT_ASSET_LIST_SELECT_COLUMNS } from '../../shared/constants'

interface FetchBattalionEquipmentAssetsOptions {
  battalionCode: string
  search: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchBattalionEquipmentAssets(
  supabase: SupabaseClient,
  options: FetchBattalionEquipmentAssetsOptions,
) {
  const { battalionCode, search, rangeFrom, rangeTo } = options

  let assetsQuery = supabase
    .from('vw_equipment_accountability')
    .select(UNIT_EQUIPMENT_ASSET_LIST_SELECT_COLUMNS, { count: 'exact' })
    .eq('assigned_battalion_code', battalionCode)
    .order('asset_tag', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search.length > 0) {
    assetsQuery = assetsQuery.or([
      `asset_tag.ilike.%${search}%`,
      `equipment_code.ilike.%${search}%`,
      `item_name.ilike.%${search}%`,
      `assigned_personnel_code.ilike.%${search}%`,
    ].join(','))
  }

  const { data, count, error } = await assetsQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalion equipment assets: ${error.message}` })
  }

  return {
    rows: data ?? [],
    totalItems: count ?? 0,
  }
}
