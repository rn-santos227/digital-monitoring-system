import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import { EQUIPMENT_INCIDENT_LIST_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentIncidentRow } from '../../shared/models'

export const getEquipmentIncidentById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<EquipmentIncidentRow | null> => {
  const { data, error } = await supabase
    .from('equipment_incidents')
    .select(EQUIPMENT_INCIDENT_LIST_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()


}
