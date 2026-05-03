import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { COMPANY_SELECT_COLUMNS } from '../../shared/constants'
import type { CompanyRow } from '../../shared/models'

interface FetchCompaniesListParams {
  search: string
  includeInactive: boolean
  battalionId: string | null
  rangeFrom: number
  rangeTo: number
}

export async function fetchCompaniesList(supabase: SupabaseClient, params: FetchCompaniesListParams) {
  let query = supabase
    .from('companies')
    .select(COMPANY_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (params.search) {
    query = query.or(`code.ilike.%${params.search}%,name.ilike.%${params.search}%`)
  }

  if (!params.includeInactive) {
    query = query.eq('is_active', true)
  }

  if (params.battalionId) {
    query = query.eq('battalion_id', params.battalionId)
  }

  const { data, count, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch companies: ${error.message}` })
  }

  return {
    data: (data ?? []) as CompanyRow[],
    count: count ?? 0,
  }
}
