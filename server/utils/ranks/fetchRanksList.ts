import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { RANK_LIST_SELECT_COLUMNS } from '../../shared/constants'
import type { RankRow } from '../../shared/models'

interface FetchRanksListParams {
  search: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchRanksList(
  supabase: SupabaseClient,
  { search, rangeFrom, rangeTo }: FetchRanksListParams,
): Promise<{ data: RankRow[], count: number }> {
  let rankQuery = supabase
    .from('ranks')
    .select(RANK_LIST_SELECT_COLUMNS, { count: 'exact' })
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    rankQuery = rankQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
  }

  const { data, count, error } = await rankQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch ranks: ${error.message}` })
  }

  return {
    data: (data ?? []) as RankRow[],
    count: count ?? 0,
  }
}
