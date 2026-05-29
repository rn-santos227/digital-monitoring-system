import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ASSET_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentAssetSuggestionRow } from '../../shared/models'

export const fetchEquipmentAssetSuggestions = async (
  supabase: SupabaseClient,
  term: string,
  limit: number,
  selectedId: string | null = null,
): Promise<EquipmentAssetSuggestionRow[]> => {
  let query = supabase
    .from('equipment_assets')
    .select(EQUIPMENT_ASSET_SUGGESTION_SELECT_COLUMNS)
    .order('asset_tag', { ascending: true })

  if (selectedId) {
    query = query.or(`id.eq.${selectedId},asset_tag.ilike.%${term}%`)
  } else if (term) {
    query = query.ilike('asset_tag', `%${term}%`)
  }

  const { data, error } = await query.limit(limit + (selectedId ? 1 : 0))

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const rows = (data ?? []) as EquipmentAssetSuggestionRow[]

  if (!selectedId) {
    return rows
  }

  const selectedRow = rows.find((row) => row.id === selectedId)
  const filteredRows = rows.filter((row) => row.id !== selectedId).slice(0, limit)

  return selectedRow ? [selectedRow, ...filteredRows] : filteredRows
}
