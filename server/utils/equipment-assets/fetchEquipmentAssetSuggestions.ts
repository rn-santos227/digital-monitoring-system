import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ASSET_SUGGESTION_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentAssetSuggestionRow } from '../../shared/models'

export const fetchEquipmentAssetSuggestions = async (
  supabase: SupabaseClient,
  term: string,
  limit: number,
): Promise<EquipmentAssetSuggestionRow[]> => {
  let query = supabase
    .from('equipment_assets')
    .select(EQUIPMENT_ASSET_SUGGESTION_SELECT_COLUMNS)
    .order('asset_tag', { ascending: true })
    .limit(limit)

  if (term) {
    query = query.ilike('asset_tag', `%${term}%`)
  }

  const { data, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return (data ?? []) as EquipmentAssetSuggestionRow[]
}
