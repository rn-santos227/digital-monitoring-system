import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { RANK_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'

const SEARCHABLE_FIELDS = ['code', 'name'] as const

export async function fetchRankSuggestions(
  supabase: SupabaseClient,
  term: string,
  pageSize: number,
): Promise<Array<{ id: string; code: string; name: string; sort_order: number | null }>> {
  let rankQuery = supabase
    .from('ranks')
    .select(RANK_SUGGESTION_SELECT_COLUMNS)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
    .limit(pageSize)

  if (term.length > 0) {
    const filters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)

    if (filters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
    }

    rankQuery = rankQuery.or(filters.join(','))
  }

  const { data, error } = await rankQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch rank suggestions: ${error.message}` })
  }

  return (data ?? []) as Array<{ id: string; code: string; name: string; sort_order: number | null }>
}
