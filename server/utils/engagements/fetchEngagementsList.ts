import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ENGAGEMENT_SELECT_COLUMNS } from '../../shared/constants'
import type { EngagementRow } from '../../shared/models'

interface FetchEngagementsListParams {
  search: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchEngagementsList(supabase: SupabaseClient, params: FetchEngagementsListParams) {
  let query = supabase
    .from('engagements')
    .select(ENGAGEMENT_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('engagement_title', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (params.search) {
    query = query.or(`engagement_title.ilike.%${params.search}%,default_remarks.ilike.%${params.search}%`)
  }

  const { data, count, error } = await query
  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch engagements: ${error.message}` })
  }

  return { data: (data ?? []) as EngagementRow[], count: count ?? 0 }
}
