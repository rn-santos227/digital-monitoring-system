import type { SupabaseClient } from '@supabase/supabase-js'
import type { PersonnelUpdate } from '../../shared/models'

export const updatePersonnelById = async (
  supabase: SupabaseClient,
  id: string,
  updates: Partial<PersonnelUpdate>,
) => {
  return supabase.from('personnel').update(updates).eq('id', id)
}
