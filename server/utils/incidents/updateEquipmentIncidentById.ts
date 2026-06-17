import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { EquipmentIncidentUpdate } from '../../shared/models'

export const updateEquipmentIncidentById = async (
  supabase: SupabaseClient,
  id: string,
  updates: EquipmentIncidentUpdate,
): Promise<void> => {


}
