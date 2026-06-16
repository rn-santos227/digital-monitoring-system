import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { EquipmentIncidentCreate } from '../../shared/models'

export const createEquipmentIncident = async (
  supabase: SupabaseClient,
  payload: EquipmentIncidentCreate,
): Promise<string> => {

}
