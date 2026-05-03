import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DeploymentRecordRow } from '../../shared/models'
import { DEPLOYMENT_RECORD_DETAIL_SELECT_COLUMNS } from '../../shared/constants'

interface FetchDeploymentRecordsListParams {
  search: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchDeploymentRecordsList(supabase: SupabaseClient, params: FetchDeploymentRecordsListParams) {
  const { search, rangeFrom, rangeTo } = params

  let query = supabase
    .from('deployment_records')
    .select(DEPLOYMENT_RECORD_DETAIL_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('deployment_area', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    query = query.or(
      `record_no.ilike.%${search}%,deployment_area.ilike.%${search}%,operation_name.ilike.%${search}%,location.ilike.%${search}%,assignment_role.ilike.%${search}%,remarks.ilike.%${search}%`,
    )
  }

  const { data, count, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch deployment records: ${error.message}` })
  }

  return {
    rows: (data ?? []) as DeploymentRecordRow[],
    totalItems: count ?? 0,
  }
}
