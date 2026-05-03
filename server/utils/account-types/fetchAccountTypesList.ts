import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ACCOUNT_TYPE_BASE_SELECT_COLUMNS } from '../../shared/constants'

interface FetchAccountTypesListOptions {
  search: string
  includeSystem: boolean
  rangeFrom: number
  rangeTo: number
}

export async function fetchAccountTypesList(supabase: SupabaseClient, options: FetchAccountTypesListOptions) {
  const { search, includeSystem, rangeFrom, rangeTo } = options

  let accountTypeQuery = supabase
    .from('account_types')
    .select(ACCOUNT_TYPE_BASE_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    accountTypeQuery = accountTypeQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
  }

  if (!includeSystem) {
    accountTypeQuery = accountTypeQuery.eq('is_system', false)
  }

  const { data, count, error } = await accountTypeQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch account types: ${error.message}` })
  }

  return {
    rows: data ?? [],
    totalItems: count ?? 0,
  }
}
