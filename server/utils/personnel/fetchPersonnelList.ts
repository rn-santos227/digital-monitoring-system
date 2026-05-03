import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'

interface FetchPersonnelListOptions {
  search: string
  rangeFrom: number
  rangeTo: number
}

export const fetchPersonnelList = async (
  supabase: SupabaseClient,
  options: FetchPersonnelListOptions,
) => {
  let query = supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_PROFILE_LIST_SELECT_COLUMNS, { count: 'exact' })
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .range(options.rangeFrom, options.rangeTo)

  if (options.search) {
    query = query.or([
      `personnel_code.ilike.%${options.search}%`,
      `service_number.ilike.%${options.search}%`,
      `last_name.ilike.%${options.search}%`,
      `first_name.ilike.%${options.search}%`,
    ].join(','))
  }

  return query
}
