import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { EngagementRecordRow } from '../../shared/models'
import { ENGAGEMENT_RECORD_LIST_SELECT_COLUMNS } from '../../shared/constants'

interface FetchEngagementRecordsListParams {
  search: string
  rangeFrom: number
  rangeTo: number
}

interface FetchEngagementRecordsListResult {
  rows: EngagementRecordRow[]
  totalItems: number
}

export async function fetchEngagementRecordsList(
  supabase: SupabaseClient,
  params: FetchEngagementRecordsListParams,
): Promise<FetchEngagementRecordsListResult> {
  let engagementRecordQuery = supabase
    .from('engagement_records')
    .select(ENGAGEMENT_RECORD_LIST_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('engagement_title', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (params.search) {
    engagementRecordQuery = engagementRecordQuery.or(
      `record_no.ilike.%${params.search}%,engagement_title.ilike.%${params.search}%,certificate_no.ilike.%${params.search}%,remarks.ilike.%${params.search}%`,
    )
  }

  const { data, count, error } = await engagementRecordQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch engagement records: ${error.message}` })
  }

  return {
    rows: (data as EngagementRecordRow[] | null) ?? [],
    totalItems: count ?? 0,
  }
}
