import { createError, defineEventHandler, getQuery } from 'h3'
import type { TrainingRecordListResponse } from '../../shared/responses'
import { PERMISSION_CODES, TRAINING_RECORD_SELECT_COLUMNS } from '../../shared/constants'
import { mapTrainingRecordListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<TrainingRecordListResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingView)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  let trainingRecordQuery = supabase
    .from('training_records')
    .select(TRAINING_RECORD_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('training_title', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    trainingRecordQuery = trainingRecordQuery.or(
      `record_no.ilike.%${search}%,training_title.ilike.%${search}%,certificate_no.ilike.%${search}%,remarks.ilike.%${search}%`,
    )
  }

  const { data, count, error } = await trainingRecordQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch training records: ${error.message}` })
  }

  const items = (data ?? []).map(mapTrainingRecordListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
