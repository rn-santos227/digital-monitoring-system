import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ISSUANCE_SELECT_COLUMNS } from '../../shared/constants'

export async function fetchEquipmentIssuancesList(
  supabase: SupabaseClient,
  params: { search: string; rangeFrom: number; rangeTo: number },
) {
  let query = supabase
    .from('equipment_issuances')
    .select(EQUIPMENT_ISSUANCE_SELECT_COLUMNS, { count: 'exact' })

  if (params.search) {
    query = query.or([
      `issue_no.ilike.%${params.search}%`,
      `remarks.ilike.%${params.search}%`,
      `issued_location.ilike.%${params.search}%`,
    ].join(','))
  }

  const { data, count, error } = await query
    .order('issue_date', { ascending: false })
    .range(params.rangeFrom, params.rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch equipment issuances: ${error.message}` })
  }

  return { rows: data ?? [], totalItems: count ?? 0 }
}
