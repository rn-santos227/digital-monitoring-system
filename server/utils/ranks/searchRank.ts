import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { RANK_LIST_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter, RankRow } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchRanksOptions {
  filters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  rangeFrom: number
  rangeTo: number
}

export const searchRank = async (
  supabase: SupabaseClient,
  options: SearchRanksOptions,
): Promise<{ data: RankRow[]; count: number }> => {
  let query = supabase
    .from('ranks')
    .select(RANK_LIST_SELECT_COLUMNS, { count: 'exact' })

  query = applyPersonnelSearchFilters(query, options.filters, options.match)

  const { data, count, error } = await query
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .range(options.rangeFrom, options.rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search ranks: ${error.message}` })
  }

  return {
    data: (data ?? []) as RankRow[],
    count: count ?? 0,
  }
}
