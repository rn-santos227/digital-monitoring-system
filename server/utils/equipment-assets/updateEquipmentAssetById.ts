import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EquipmentAssetUpdate } from '../../shared/models'

export const updateEquipmentAssetById = async (
  supabase: SupabaseClient,
  id: string,
  updates: EquipmentAssetUpdate,
): Promise<void> => {
  const { error } = await supabase
    .from('equipment_assets')
    .update(updates)
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
}
