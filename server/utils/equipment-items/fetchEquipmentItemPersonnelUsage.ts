import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ITEM_PERSONNEL_USAGE_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentItemPersonnelUsageRow } from '../../shared/models'

interface FetchEquipmentItemPersonnelUsageOptions {
  equipmentItemId: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchEquipmentItemPersonnelUsage(
  supabase: SupabaseClient,
  options: FetchEquipmentItemPersonnelUsageOptions,
) {
  const { equipmentItemId, rangeFrom, rangeTo } = options

  const { data, count, error } = await supabase
    .from('equipment_issuances')
    .select<string, EquipmentItemPersonnelUsageRow>(EQUIPMENT_ITEM_PERSONNEL_USAGE_SELECT_COLUMNS, { count: 'exact' })
    .eq('equipment_asset.equipment_item_id', equipmentItemId)
    .order('issue_date', { ascending: false })
    .order('issue_no', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch equipment item personnel usage: ${error.message}` })
  }

  return {
    rows: data ?? [],
    totalItems: count ?? 0,
  }
}
