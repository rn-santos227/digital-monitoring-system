import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'

interface SearchPersonnelOptions {
  filters: string[]
  rangeFrom: number
  rangeTo: number
}

export const searchPersonnel = async (supabase: SupabaseClient, options: SearchPersonnelOptions) => {
  return supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_PROFILE_LIST_SELECT_COLUMNS, { count: 'exact' })
    .or(options.filters.join(','))
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .range(options.rangeFrom, options.rangeTo)
}
