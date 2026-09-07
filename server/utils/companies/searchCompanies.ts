import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { COMPANY_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchCompaniesParams {
  term: string
  isActive: boolean | null
  battalionId: string | null
  rangeFrom: number
  rangeTo: number
  fields: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
}

export async function searchCompanies(supabase: SupabaseClient, params: SearchCompaniesParams) {
  const filters = params.term ? params.fields.map(field => `${field}.ilike.%${params.term}%`) : []

  let query = supabase
    .from('companies')
    .select(COMPANY_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (filters.length > 0) {
    query = query.or(filters.join(','))
  }

  if (typeof params.isActive === 'boolean') {
    query = query.eq('is_active', params.isActive)
  }

  if (params.battalionId) {
    query = query.eq('battalion_id', params.battalionId)
  }

  const { data, count, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search companies: ${error.message}` })
  }

  return { data: data ?? [], count: count ?? 0 }
}
