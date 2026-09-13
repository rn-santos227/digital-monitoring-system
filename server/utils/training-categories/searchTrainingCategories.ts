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
  filters: string[],
  rangeFrom: number,
  rangeTo: number,
) {
  const { data, count, error } = await supabase
    .from('training_categories')
    .select(TRAINING_CATEGORY_SELECT_COLUMNS, { count: 'exact' })
    .or(filters.join(','))
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search training categories: ${error.message}` })
  }

  return { rows: data ?? [], totalItems: count ?? 0 }
}
