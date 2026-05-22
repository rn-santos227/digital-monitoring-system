import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ASSET_DETAILS_COLUMNS } from '../../shared/constants'
import type { EquipmentAssetRow } from '../../shared/models'

export const getEquipmentAssetById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<EquipmentAssetRow | null> => {
  const { data, error } = await supabase
    .from('equipment_assets')
    .select(EQUIPMENT_ASSET_DETAILS_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data as EquipmentAssetRow | null
}
