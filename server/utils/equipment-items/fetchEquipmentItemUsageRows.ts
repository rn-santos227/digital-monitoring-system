import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ITEM_PERSONNEL_USAGE_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentItemPersonnelUsageRow } from '../../shared/models'

export async function fetchEquipmentItemUsageRows(
  supabase: SupabaseClient,
  equipmentItemId: string,
): Promise<EquipmentItemPersonnelUsageRow[]> {
  const { data, error } = await supabase
    .from('equipment_issuances')
    .select<string, EquipmentItemPersonnelUsageRow>(EQUIPMENT_ITEM_PERSONNEL_USAGE_SELECT_COLUMNS)
    .eq('equipment_asset.equipment_item_id', equipmentItemId)
    .order('issue_date', { ascending: false })
    .order('issue_no', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch equipment item usage rows: ${error.message}` })
  }

  return data ?? []
}
