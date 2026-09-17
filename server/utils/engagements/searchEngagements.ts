import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { ENGAGEMENT_SELECT_COLUMNS } from '../../shared/constants'
import type { EngagementRow, PersonnelSearchFilter } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchEngagementsParams {
  filters: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  engagementCategoryId: string | null
  statusId: string | null
  rangeFrom: number
  rangeTo: number
}

export async function searchEngagements(
  supabase: SupabaseClient,
  params: SearchEngagementsParams,
) {
  let query = supabase
    .from('engagements')
    .select(ENGAGEMENT_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('engagement_title', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (params.filters.length > 0) query = query.or(params.filters.join(','))
  if (params.engagementCategoryId) query = query.eq('engagement_type_id', params.engagementCategoryId)
  if (params.statusId) query = query.eq('status_id', params.statusId)

  const { data, count, error } = await query
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to search engagements: ${error.message}` })

  return { data: (data ?? []) as EngagementRow[], count: count ?? 0 }
}
