import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { BATTALION_SELECT_COLUMNS } from '../../shared/constants'

interface FetchBattalionsListOptions {
  search: string
  includeInactive: boolean
  rangeFrom: number
  rangeTo: number
}

export async function fetchBattalionsList(
  supabase: SupabaseClient,
  options: FetchBattalionsListOptions,
) {
  const { search, includeInactive, rangeFrom, rangeTo } = options

  let battalionQuery = supabase
    .from('battalions')
    .select(BATTALION_SELECT_COLUMNS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    battalionQuery = battalionQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
  }

  if (!includeInactive) {
    battalionQuery = battalionQuery.eq('is_active', true)
  }

  const { data, count, error } = await battalionQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch battalions: ${error.message}` })
  }

  return {
    rows: data ?? [],
    totalItems: count ?? 0,
  }
}
