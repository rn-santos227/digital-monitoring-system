import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { BATTALION_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchBattalionsOptions {
  searchFilters: string[]
  isActive: boolean | null
  rangeFrom: number
  rangeTo: number
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
}

export async function searchBattalions(supabase: SupabaseClient, options: SearchBattalionsOptions) {
  const { searchFilters, isActive, rangeFrom, rangeTo } = options

  let battalionQuery = supabase
    .from('battalions')
    .select(BATTALION_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (searchFilters.length > 0) {
    battalionQuery = battalionQuery.or(searchFilters.join(','))
  }

  if (options.advancedFilters.length > 0) {
    battalionQuery = applyPersonnelSearchFilters(battalionQuery, options.advancedFilters, options.match)
  }

  if (typeof isActive === 'boolean') {
    battalionQuery = battalionQuery.eq('is_active', isActive)
  }

  const { data, count, error } = await battalionQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search battalions: ${error.message}` })
  }

  return {
    rows: data ?? [],
    totalItems: count ?? 0,
  }
}
