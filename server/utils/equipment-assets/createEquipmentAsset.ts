import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ID_ONLY_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentAssetCreate } from '../../shared/models'

export const createEquipmentAsset = async (
  supabase: SupabaseClient,
  payload: EquipmentAssetCreate,
): Promise<string> => {
  const { data, error } = await supabase
    .from('equipment_assets')
    .insert(payload)
    .select(ID_ONLY_SELECT_COLUMNS)
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data.id as string
}
