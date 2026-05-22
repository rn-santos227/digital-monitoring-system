import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ISSUANCE_SELECT_COLUMNS } from '../../shared/constants'

export async function searchEquipmentIssuances(
  supabase: SupabaseClient,
  params: { term: string; issuedToPersonnelId: string | null; statusId: string | null; rangeFrom: number; rangeTo: number },
) {
  const filters: string[] = []

  if (params.term) {
    filters.push(`issue_no.ilike.%${params.term}%`)
    filters.push(`remarks.ilike.%${params.term}%`)
    filters.push(`issued_location.ilike.%${params.term}%`)
  }

  let query = supabase.from('equipment_issuances').select(EQUIPMENT_ISSUANCE_SELECT_COLUMNS, { count: 'exact' })

  if (filters.length > 0) {
    query = query.or(filters.join(','))
  }

  if (params.issuedToPersonnelId) {
    query = query.eq('issued_to_personnel_id', params.issuedToPersonnelId)
  }

  if (params.statusId) {
    query = query.eq('status_id', params.statusId)
  }

  const { data, count, error } = await query.order('issue_date', { ascending: false }).range(params.rangeFrom, params.rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search equipment issuances: ${error.message}` })
  }

  return { rows: data ?? [], totalItems: count ?? 0 }
}
