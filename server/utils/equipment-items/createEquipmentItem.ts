import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { EquipmentItemCreate } from '../../shared/models'

export async function createEquipmentItem(supabase: SupabaseClient, payload: EquipmentItemCreate): Promise<string> {
  const { data: createdRow, error: insertError } = await supabase
    .from('equipment_items')
    .insert(payload)
    .select('id')
    .maybeSingle<{ id: string }>()

  if (insertError || !createdRow?.id) {
    throw createError({ statusCode: 500, statusMessage: `Failed to create equipment item: ${insertError?.message ?? 'Missing id.'}` })
  }

  return createdRow.id
}
