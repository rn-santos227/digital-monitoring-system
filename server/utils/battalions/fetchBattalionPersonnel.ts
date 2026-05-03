import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { BATTALION_PERSONNEL_LIST_SELECT_COLUMNS } from '../../shared/constants'

interface FetchBattalionPersonnelOptions {
  battalionId: string
  search: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchBattalionPersonnel(
  supabase: SupabaseClient,
  options: FetchBattalionPersonnelOptions,
) {
  const { battalionId, search, rangeFrom, rangeTo } = options

  let personnelQuery = supabase
    .from('vw_personnel_profile')
    .select(BATTALION_PERSONNEL_LIST_SELECT_COLUMNS, { count: 'exact' })
    .eq('battalion_id', battalionId)
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search.length > 0) {
    personnelQuery = personnelQuery.or([
      `personnel_code.ilike.%${search}%`,
      `service_number.ilike.%${search}%`,
      `last_name.ilike.%${search}%`,
      `first_name.ilike.%${search}%`,
    ].join(','))
  }

  const { data, count, error } = await personnelQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalion personnel: ${error.message}` })
  }

  return {
    rows: data ?? [],
    totalItems: count ?? 0,
  }
}
