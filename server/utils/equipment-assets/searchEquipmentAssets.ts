import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ASSET_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentAssetRow, PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchEquipmentAssetsOptions {
  searchFilters: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  rangeFrom: number
  rangeTo: number
}

export async function searchEquipmentAssets(supabase: SupabaseClient, options: SearchEquipmentAssetsOptions) {
  let query = supabase
    .from('equipment_assets')
    .select(EQUIPMENT_ASSET_SELECT_COLUMNS, { count: 'exact' })

  if (options.searchFilters.length > 0) {
    query = query.or(options.searchFilters.join(','))
  }

  if (options.advancedFilters.length > 0) {
    query = applyPersonnelSearchFilters(query, options.advancedFilters, options.match)
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(options.rangeFrom, options.rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search equipment assets: ${error.message}` })
  }

  return { rows: (data ?? []) as EquipmentAssetRow[], totalItems: count ?? 0 }
}
