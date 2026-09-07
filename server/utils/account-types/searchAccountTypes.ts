import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ACCOUNT_TYPE_LIST_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchAccountTypesOptions {
  searchFilters: string[]
  isSystem: boolean | null
  rangeFrom: number
  rangeTo: number
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
}

export async function searchAccountTypes(supabase: SupabaseClient, options: SearchAccountTypesOptions) {
  const { searchFilters, isSystem, rangeFrom, rangeTo } = options

  let accountTypeQuery = supabase
    .from('account_types')
    .select(ACCOUNT_TYPE_LIST_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (searchFilters.length > 0) {
    accountTypeQuery = accountTypeQuery.or(searchFilters.join(','))
  }

  if (typeof isSystem === 'boolean') {
    accountTypeQuery = accountTypeQuery.eq('is_system', isSystem)
  }

  const { data, count, error } = await accountTypeQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search account types: ${error.message}` })
  }

  return {
    rows: data ?? [],
    totalItems: count ?? 0,
  }
}
