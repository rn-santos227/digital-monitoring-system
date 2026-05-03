import type { SupabaseClient } from '@supabase/supabase-js'

export const deletePersonnelById = async (supabase: SupabaseClient, id: string) => {
  return supabase.from('personnel').delete().eq('id', id)
}
