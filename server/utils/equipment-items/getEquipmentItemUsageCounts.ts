import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ID_ONLY_SELECT_COLUMNS } from '../../shared/constants'

export async function getEquipmentItemUsageCounts(supabase: SupabaseClient, equipmentItemId: string): Promise<number> {
  const { count, error } = await supabase
    .from('equipment_assets')
    .select(ID_ONLY_SELECT_COLUMNS, { count: 'exact', head: true })
    .eq('equipment_item_id', equipmentItemId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to check equipment item usage: ${error.message}` })
  }

  return count ?? 0
}
