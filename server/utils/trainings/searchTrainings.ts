import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { TRAINING_SELECT_COLUMNS } from '../../shared/constants'
import type { PersonnelSearchFilter, TrainingRow } from '../../shared/models'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchTrainingsParams {
  filters: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  trainingCategoryId: string | null
  statusId: string | null
  rangeFrom: number
  rangeTo: number
}

export async function searchTrainings(supabase: SupabaseClient, params: SearchTrainingsParams) {
  let query = supabase
    .from('trainings')
    .select(TRAINING_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('training_title', { ascending: true })
    .range(params.rangeFrom, params.rangeTo)

  if (params.filters.length > 0) query = query.or(params.filters.join(','))
  if (params.advancedFilters.length > 0) query = applyPersonnelSearchFilters(query, params.advancedFilters, params.match)
  if (params.trainingCategoryId) query = query.eq('training_category_id', params.trainingCategoryId)
  if (params.statusId) query = query.eq('status_id', params.statusId)

  const { data, count, error } = await query
  if (error) throw createError({ statusCode: 500, statusMessage: `Failed to search trainings: ${error.message}` })

  return { data: (data ?? []) as TrainingRow[], count: count ?? 0 }
}
