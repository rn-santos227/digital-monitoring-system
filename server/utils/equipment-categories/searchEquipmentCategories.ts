import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_CATEGORY_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchEquipmentCategoriesOptions {
  searchFilters: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  isActive: boolean | null
  rangeFrom: number
  rangeTo: number
}

export async function searchEquipmentCategories(
  supabase: SupabaseClient,
  options: SearchEquipmentCategoriesOptions,
) {
  let query = supabase
    .from('equipment_categories')
    .select(EQUIPMENT_CATEGORY_SELECT_COLUMNS, { count: 'exact' })

  if (options.searchFilters.length > 0) {
    query = query.or(options.searchFilters.join(','))
  }


  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search equipment categories: ${error.message}` })
  }

  return { rows: data ?? [], totalItems: count ?? 0 }
}
