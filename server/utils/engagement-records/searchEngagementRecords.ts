import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type {
  EngagementRecordRow,
  PersonnelSearchFilter,
} from '../../shared/models'
import {
  ENGAGEMENT_RECORD_LIST_SELECT_COLUMNS,
  ENGAGEMENT_RECORD_SEARCHABLE_FIELD_COLUMNS,
} from '../../shared/constants'
import { applyPersonnelSearchFilters } from '../../shared/utils'
type SearchableField = keyof typeof ENGAGEMENT_RECORD_SEARCHABLE_FIELD_COLUMNS

interface SearchEngagementRecordsParams {
  term: string
  fields: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  engagementId: string | null
  personnelId: string | null
  engagementTypeId: string | null
  statusId: string | null
  rangeFrom: number
  rangeTo: number
}

interface SearchEngagementRecordsResult {
  rows: EngagementRecordRow[]
  totalItems: number
}

export async function searchEngagementRecords(
  supabase: SupabaseClient,
  params: SearchEngagementRecordsParams,
): Promise<SearchEngagementRecordsResult> {
  const selectedFields: SearchableField[] =
    params.fields.length > 0
      ? params.fields.filter(
          (field): field is SearchableField =>
            field in ENGAGEMENT_RECORD_SEARCHABLE_FIELD_COLUMNS,
        )
      : (Object.keys(
          ENGAGEMENT_RECORD_SEARCHABLE_FIELD_COLUMNS,
        ) as SearchableField[])

  const filters = params.term
    ? selectedFields.map(
        (field) =>
          `${ENGAGEMENT_RECORD_SEARCHABLE_FIELD_COLUMNS[field]}.ilike.%${params.term}%`,
      )
    : []

  if (params.term && filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  let engagementRecordQuery = supabase
    .from('engagement_records')
    .select(ENGAGEMENT_RECORD_LIST_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('engagement_title', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (filters.length > 0) engagementRecordQuery = engagementRecordQuery.or(filters.join(','))
  if (params.engagementId) engagementRecordQuery = engagementRecordQuery.eq('engagement_id', params.engagementId)
  if (params.personnelId) engagementRecordQuery = engagementRecordQuery.eq('personnel_id', params.personnelId)
  if (params.engagementTypeId) engagementRecordQuery = engagementRecordQuery.eq('engagement_type_id', params.engagementTypeId)
  if (params.statusId) engagementRecordQuery = engagementRecordQuery.eq('status_id', params.statusId)

  const { data, count, error } = await engagementRecordQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search engagement records: ${error.message}` })
  }

  return {
    rows: (data as EngagementRecordRow[] | null) ?? [],
    totalItems: count ?? 0,
  }
}
