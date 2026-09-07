import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchPersonnelOptions {
  filters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  rangeFrom: number
  rangeTo: number
}

export const searchPersonnel = async (supabase: SupabaseClient, options: SearchPersonnelOptions) => {
  let query = supabase
    .from('vw_personnel_profile')
    .select(PERSONNEL_PROFILE_LIST_SELECT_COLUMNS, { count: 'exact' })

  query = applyPersonnelSearchFilters(query, options.filters, options.match)

  return query
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .range(options.rangeFrom, options.rangeTo)
}
