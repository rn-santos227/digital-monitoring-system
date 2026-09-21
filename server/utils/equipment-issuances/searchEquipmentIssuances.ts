import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { EQUIPMENT_ISSUANCE_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

export async function searchEquipmentIssuances(
  supabase: SupabaseClient,
  params: {
    term: string
    issuedToPersonnelId: string | null
    statusId: string | null
    statusName: string | null
    rangeFrom: number
    rangeTo: number
  },
) {
  const filters: string[] = []

  if (params.term) {
    filters.push(`issue_no.ilike.%${params.term}%`)
    filters.push(`remarks.ilike.%${params.term}%`)
    filters.push(`issued_location.ilike.%${params.term}%`)
  }

  let resolvedStatusId = params.statusId

  if (!resolvedStatusId && params.statusName) {
    const { data: statusRow, error: statusError } = await supabase
      .from('issuance_statuses')
      .select('id')
      .eq('name', params.statusName)
      .maybeSingle()

    if (statusError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to resolve issuance status: ${statusError.message}` })
    }

    if (!statusRow?.id) {
      return { rows: [], totalItems: 0 }
    }

    resolvedStatusId = statusRow.id
  }

  let query = supabase.from('equipment_issuances').select(EQUIPMENT_ISSUANCE_SELECT_COLUMNS, { count: 'exact' })

  if (filters.length > 0) {
    query = query.or(filters.join(','))
  }

  if (params.issuedToPersonnelId) {
    query = query.eq('issued_to_personnel_id', params.issuedToPersonnelId)
  }

  if (resolvedStatusId) {
    query = query.eq('status_id', resolvedStatusId)
  }

  const { data, count, error } = await query.order('issue_date', { ascending: false }).range(params.rangeFrom, params.rangeTo)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search equipment issuances: ${error.message}` })
  }

  return { rows: data ?? [], totalItems: count ?? 0 }
}
