import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'

export const deleteEquipmentIncidentById = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('equipment_incidents')
    .delete()
    .eq('id', id)



}
