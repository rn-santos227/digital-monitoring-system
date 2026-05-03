import type { SupabaseClient } from '@supabase/supabase-js'
import type { PersonnelCreate } from '../../shared/models'

export const createPersonnel = async (supabase: SupabaseClient, payload: PersonnelCreate) => {
  return supabase.from('personnel').insert(payload).select('id').maybeSingle()
}
