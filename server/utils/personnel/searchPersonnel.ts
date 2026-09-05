import type { SupabaseClient } from '@supabase/supabase-js'
import { PERSONNEL_PROFILE_LIST_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'

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

  if (options.match === 'any') {
    const expressions = options.filters.map((filter) => {
      const escapedValue = filter.value.replace(/["\\]/g, '')
      return `${filter.column}.${filter.operator}."${escapedValue}"`
    })
    query = query.or(expressions.join(','))
  } else {
    options.filters.forEach((filter) => {
      query = query.filter(filter.column, filter.operator, filter.value)
    })
  }

  return query
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .range(options.rangeFrom, options.rangeTo)
}
