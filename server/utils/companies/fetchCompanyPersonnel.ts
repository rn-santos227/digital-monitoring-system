import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { COMPANY_PERSONNEL_LIST_SELECT_COLUMNS } from '../../shared/constants'

export async function fetchCompanyPersonnel(supabase: SupabaseClient, companyId: string, search: string, rangeFrom: number, rangeTo: number) {
  let query = supabase
    .from('vw_personnel_profile')
    .select(COMPANY_PERSONNEL_LIST_SELECT_COLUMNS, { count: 'exact' })
    .eq('company_id', companyId)
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search.length > 0) {
    query = query.or(`personnel_code.ilike.%${search}%,service_number.ilike.%${search}%,last_name.ilike.%${search}%,first_name.ilike.%${search}%`)
  }

  const { data, count, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch company personnel: ${error.message}` })
  }

  return { data: data ?? [], count: count ?? 0 }
}
