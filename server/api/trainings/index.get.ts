import { createError, defineEventHandler, getQuery } from 'h3'
import type { TrainingListResponse } from '../../shared/responses'
import { PERMISSION_CODES, TRAINING_SELECT_COLUMNS } from '../../shared/constants'
import { mapTrainingListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<TrainingListResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingView)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  let trainingQuery = supabase
    .from('trainings')
    .select(TRAINING_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('training_title', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    trainingQuery = trainingQuery.or(`training_title.ilike.%${search}%,default_remarks.ilike.%${search}%`)
  }

  const { data, count, error } = await trainingQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch trainings: ${error.message}` })
  }

  const items = (data ?? []).map(mapTrainingListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
