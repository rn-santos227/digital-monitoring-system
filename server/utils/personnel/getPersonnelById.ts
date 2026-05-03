import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_PROFILE_DETAIL_SELECT_COLUMNS } from '../../shared/constants'

export const getPersonnelById = async (supabase: SupabaseClient, id: string) => {
  return supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_PROFILE_DETAIL_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()
}
