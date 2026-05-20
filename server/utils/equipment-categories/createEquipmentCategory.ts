import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EquipmentCategoryCreate } from '../../shared/models'

export async function createEquipmentCategory(supabase: SupabaseClient, payload: EquipmentCategoryCreate): Promise<string> {
  const { data: createdRow, error: insertError } = await supabase
    .from('equipment_categories')
    .insert(payload)
    .select('id')
    .maybeSingle<{ id: string }>()

  if (insertError || !createdRow?.id) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create equipment category: ${insertError?.message ?? 'Missing id.'}` })
  }

  return createdRow.id
}
