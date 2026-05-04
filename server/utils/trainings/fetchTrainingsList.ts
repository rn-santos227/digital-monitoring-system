import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { TRAINING_SELECT_COLUMNS } from '../../shared/constants'
import type { TrainingRow } from '../../shared/models'

interface FetchTrainingsListParams {
  search: string
  rangeFrom: number
  rangeTo: number
}

export async function fetchTrainingsList(supabase: SupabaseClient, params: FetchTrainingsListParams) {
  let query = supabase
    .from('trainings')
    .select(TRAINING_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('training_title', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (params.search) {
    query = query.or(`training_title.ilike.%${params.search}%,default_remarks.ilike.%${params.search}%`)
  }

  const { data, count, error } = await query
  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch trainings: ${error.message}` })
  }

  return { data: (data ?? []) as TrainingRow[], count: count ?? 0 }
}
