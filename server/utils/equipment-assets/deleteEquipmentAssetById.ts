import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'

export const deleteEquipmentAssetById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('equipment_assets')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
}
