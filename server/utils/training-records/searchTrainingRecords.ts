import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { PersonnelSearchFilter, TrainingRecordRow } from '../../shared/models'
import { TRAINING_RECORD_SEARCHABLE_FIELD_COLUMNS, TRAINING_RECORD_SELECT_COLUMNS } from '../../shared/constants'
import { applyPersonnelSearchFilters } from '../../shared/utils'

type SearchableField = keyof typeof TRAINING_RECORD_SEARCHABLE_FIELD_COLUMNS

interface SearchTrainingRecordsParams {
  term: string
  fields: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  trainingId: string | null
  personnelId: string | null
  trainingCategoryId: string | null
  statusId: string | null
  rangeFrom: number
  rangeTo: number
}

interface SearchTrainingRecordsResult {
  rows: TrainingRecordRow[]
  totalItems: number
}

export async function searchTrainingRecords(
  supabase: SupabaseClient,
  params: SearchTrainingRecordsParams,
): Promise<SearchTrainingRecordsResult> {
  const selectedFields: SearchableField[] = params.fields.length > 0
    ? params.fields.filter((field): field is SearchableField => field in TRAINING_RECORD_SEARCHABLE_FIELD_COLUMNS)
    : Object.keys(TRAINING_RECORD_SEARCHABLE_FIELD_COLUMNS) as SearchableField[]

  const filters = params.term
    ? selectedFields.map(field => `${TRAINING_RECORD_SEARCHABLE_FIELD_COLUMNS[field]}.ilike.%${params.term}%`)
    : []

  if (params.term && filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  let trainingRecordQuery = supabase
    .from('training_records')
    .select(TRAINING_RECORD_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('training_title', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (filters.length > 0) trainingRecordQuery = trainingRecordQuery.or(filters.join(','))
  if (params.trainingId) trainingRecordQuery = trainingRecordQuery.eq('training_id', params.trainingId)
  if (params.personnelId) trainingRecordQuery = trainingRecordQuery.eq('personnel_id', params.personnelId)
  if (params.trainingCategoryId) trainingRecordQuery = trainingRecordQuery.eq('training_category_id', params.trainingCategoryId)
  if (params.statusId) trainingRecordQuery = trainingRecordQuery.eq('status_id', params.statusId)

  const { data, count, error } = await trainingRecordQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search training records: ${error.message}` })
  }

  return {
    rows: (data as TrainingRecordRow[] | null) ?? [],
    totalItems: count ?? 0,
  }
}
