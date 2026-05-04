import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import type { TrainingRecordRow } from '../../shared/models'
import { TRAINING_RECORD_SELECT_COLUMNS } from '../../shared/constants'

interface FetchTrainingRecordsListParams {
  search: string
  rangeFrom: number
  rangeTo: number
}

interface FetchTrainingRecordsListResult {
  rows: TrainingRecordRow[]
  totalItems: number
}

export async function fetchTrainingRecordsList(
  supabase: SupabaseClient,
  params: FetchTrainingRecordsListParams,
): Promise<FetchTrainingRecordsListResult> {
  let trainingRecordQuery = supabase
    .from('training_records')
    .select(TRAINING_RECORD_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('training_title', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (params.search) {
    trainingRecordQuery = trainingRecordQuery.or(
      `record_no.ilike.%${params.search}%,training_title.ilike.%${params.search}%,certificate_no.ilike.%${params.search}%,remarks.ilike.%${params.search}%`,
    )
  }

  const { data, count, error } = await trainingRecordQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch training records: ${error.message}` })
  }

  return {
    rows: (data as TrainingRecordRow[] | null) ?? [],
    totalItems: count ?? 0,
  }
}
