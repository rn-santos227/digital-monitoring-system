import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'

export const getPersonnelSuggestionByServiceNumber = async (supabase: SupabaseClient, serviceNumber: string) => {
  return supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_PROFILE_LIST_SELECT_COLUMNS)
    .eq('service_number', serviceNumber)
    .maybeSingle()
}
