import type { SupabaseClient } from '@supabase/supabase-js'
import type { EquipmentItemKpiCounts } from '../../shared/models'
import { countTableRows } from '../kpis/countTableRows'

export const fetchEquipmentItemKpiCounts = async (
  supabase: SupabaseClient,
): Promise<EquipmentItemKpiCounts> => {
  return {
    totalItems: await countTableRows(supabase, 'equipment_items', 'equipment items'),
  }
}
