import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_CATEGORY_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentCategorySuggestionRow } from '../../shared/models'

const SEARCHABLE_FIELDS = ['code', 'name'] as const

export async function fetchEquipmentCategorySuggestions(
  supabase: SupabaseClient,
  term: string,
  pageSize: number,
  selectedId: string | null = null,
): Promise<EquipmentCategorySuggestionRow[]> {
  let categoryQuery = supabase
    .from('equipment_categories')
    .select(EQUIPMENT_CATEGORY_SUGGESTION_SELECT_COLUMNS)
    .order('name', { ascending: true })

  if (selectedId) {
    const searchFilters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)
    categoryQuery = categoryQuery.or([`id.eq.${selectedId}`, ...searchFilters].join(','))
  } else if (term.length > 0) {
    const filters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)
    categoryQuery = categoryQuery.or(filters.join(','))
  }

  const { data, error } = await categoryQuery.limit(pageSize + (selectedId ? 1 : 0))

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch equipment category suggestions: ${error.message}` })
  }

  const rows = (data ?? []) as EquipmentCategorySuggestionRow[]
  if (!selectedId) {
    return rows
  }

  const selectedRow = rows.find((row) => row.id === selectedId)
  const filteredRows = rows.filter((row) => row.id !== selectedId).slice(0, pageSize)

  return selectedRow ? [selectedRow, ...filteredRows] : filteredRows.slice(0, pageSize)
}
