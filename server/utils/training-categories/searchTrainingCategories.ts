import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { TRAINING_CATEGORY_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchTrainingCategoriesParams {
  filters: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  rangeFrom: number
  rangeTo: number
}

export async function searchTrainingCategories(
  supabase: SupabaseClient,
  params: SearchTrainingCategoriesParams,
) {
  let query = supabase
    .from('training_categories')
    .select(TRAINING_CATEGORY_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (params.filters.length > 0) query = query.or(params.filters.join(','))
  if (params.advancedFilters.length > 0) {
    query = applyPersonnelSearchFilters(query, params.advancedFilters, params.match)
  }

  const { data, count, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search training categories: ${error.message}` })
  }

  return { rows: data ?? [], totalItems: count ?? 0 }
}
