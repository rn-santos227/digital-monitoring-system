import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { BATTALION_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'

interface FetchBattalionSuggestionsOptions {
  term: string
  pageSize: number
  selectedId: string | null
  searchableFields: readonly string[]
}

export async function fetchBattalionSuggestions(
  supabase: SupabaseClient,
  options: FetchBattalionSuggestionsOptions,
) {
  const { term, pageSize, selectedId, searchableFields } = options

  let battalionQuery = supabase
    .from('battalions')
    .select(BATTALION_SUGGESTION_SELECT_COLUMNS)
    .eq('is_active', true)
    .order('name', { ascending: true })
    .limit(pageSize)

  if (term.length > 0) {
    const filters = searchableFields.map((field) => `${field}.ilike.%${term}%`)

    if (filters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
    }

    battalionQuery = battalionQuery.or(filters.join(','))
  }

  const { data, error } = await battalionQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalion suggestions: ${error.message}` })
  }

  const rows = [...(data ?? [])]

  if (selectedId && !rows.some(row => row.id === selectedId)) {
    const { data: selectedRow, error: selectedError } = await supabase
      .from('battalions')
      .select(BATTALION_SUGGESTION_SELECT_COLUMNS)
      .eq('id', selectedId)
      .maybeSingle()

    if (selectedError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to fetch selected battalion suggestion: ${selectedError.message}` })
    }

    if (selectedRow) {
      rows.unshift(selectedRow)
    }
  }

  return {
    rows,
  }
}
