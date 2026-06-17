import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import { EQUIPMENT_INCIDENT_LIST_SELECT_COLUMNS } from '../../shared/constants'
import type { EquipmentIncidentRow } from '../../shared/models'

export const getEquipmentIncidentById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<EquipmentIncidentRow | null> => {


}
