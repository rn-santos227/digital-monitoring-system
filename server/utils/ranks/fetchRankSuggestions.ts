import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { RANK_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { RankSuggestionRow } from '../../shared/models'

const SEARCHABLE_FIELDS = ['code', 'name'] as const

export async function fetchRankSuggestions(
  supabase: SupabaseClient,
  term: string,
  pageSize: number,
  selectedId: string | null = null,
): Promise<RankSuggestionRow[]> {
  let rankQuery = supabase
    .from('ranks')
    .select(RANK_SUGGESTION_SELECT_COLUMNS)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (selectedId) {
    const searchFilters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)
    rankQuery = rankQuery.or([`id.eq.${selectedId}`, ...searchFilters].join(','))
  } else if (term.length > 0) {
    const filters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)

    if (filters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
    }

    rankQuery = rankQuery.or(filters.join(','))
  }

  const { data, error } = await rankQuery.limit(pageSize + (selectedId ? 1 : 0))

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch rank suggestions: ${error.message}` })
  }

  const rows = ((data ?? []) as RankSuggestionRow[]).map(row => ({ ...row, sort_order: row.sort_order ?? 0 }))
  if (!selectedId) return rows

  const selectedRow = rows.find((row) => row.id === selectedId)
  const filteredRows = rows.filter((row) => row.id !== selectedId).slice(0, pageSize)
  return selectedRow ? [selectedRow, ...filteredRows] : filteredRows.slice(0, pageSize)
}
