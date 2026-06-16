import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { EquipmentIncidentCreate, EquipmentIncidentUpdate } from '../../shared/models'

const assertReferenceExists = async (
  supabase: SupabaseClient,
  table: string,
  id: string,
  label: string,
): Promise<void> => {

}
