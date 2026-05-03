import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { BATTALION_COMPANY_LIST_SELECT_COLUMNS } from '../../shared/constants'

interface FetchBattalionCompaniesOptions {
  battalionId: string
  includeInactive: boolean
  search: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchBattalionCompanies(
  supabase: SupabaseClient,
  options: FetchBattalionCompaniesOptions,
) {
  const { battalionId, includeInactive, search, rangeFrom, rangeTo } = options

  let companyQuery = supabase
    .from('companies')
    .select(BATTALION_COMPANY_LIST_SELECT_COLUMNS, { count: 'exact' })
    .eq('battalion_id', battalionId)
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (!includeInactive) {
    companyQuery = companyQuery.eq('is_active', true)
  }

  if (search.length > 0) {
    companyQuery = companyQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
  }

  const { data, count, error } = await companyQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalion companies: ${error.message}` })
  }

  return {
    rows: data ?? [],
    totalItems: count ?? 0,
  }
}
