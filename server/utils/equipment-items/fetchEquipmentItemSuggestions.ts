import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ITEM_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentItemSuggestionRow } from '../../shared/models'

const SEARCHABLE_FIELDS = ['equipment_code', 'name', 'model', 'manufacturer'] as const

export async function fetchEquipmentItemSuggestions(
  supabase: SupabaseClient,
  term: string,
  pageSize: number,
  selectedId: string | null = null,
): Promise<EquipmentItemSuggestionRow[]> {
  let equipmentItemQuery = supabase
    .from('equipment_items')
    .select<string, EquipmentItemSuggestionRow>(EQUIPMENT_ITEM_SUGGESTION_SELECT_COLUMNS)
    .order('name', { ascending: true })

  if (selectedId) {
    const searchFilters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)
    equipmentItemQuery = equipmentItemQuery.or([`id.eq.${selectedId}`, ...searchFilters].join(','))
  } else if (term.length > 0) {
    const filters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)
    equipmentItemQuery = equipmentItemQuery.or(filters.join(','))
  }

  const { data, error } = await equipmentItemQuery.limit(pageSize + (selectedId ? 1 : 0))

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch equipment item suggestions: ${error.message}` })
  }

  const rows = data ?? []

  if (!selectedId) {
    return rows
  }

  const selectedRow = rows.find((row) => row.id === selectedId)
  const filteredRows = rows.filter((row) => row.id !== selectedId).slice(0, pageSize)

  return selectedRow ? [selectedRow, ...filteredRows] : filteredRows.slice(0, pageSize)
}
