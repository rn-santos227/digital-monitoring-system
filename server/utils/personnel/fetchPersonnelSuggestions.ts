import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'

export const fetchPersonnelSuggestions = async (supabase: SupabaseClient, pageSize: number, filter?: string) => {
  let query = supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_PROFILE_LIST_SELECT_COLUMNS)
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .limit(pageSize)

  if (filter) {
    query = query.or(filter)
  }

  return query
}
