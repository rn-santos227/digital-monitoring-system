import { createError, defineEventHandler, getQuery } from 'h3'
import type { TrainingRecordListResponse } from '../../shared/responses'
import { PERMISSION_CODES, TRAINING_RECORD_SELECT_COLUMNS } from '../../shared/constants'
import { mapTrainingRecordListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_FIELDS = {
  recordNo: 'record_no',
  trainingTitle: 'training_title',
  certificateNo: 'certificate_no',
  remarks: 'remarks',
} as const

export default defineEventHandler(async (event): Promise<TrainingRecordListResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingManage)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const trainingId = typeof query.trainingId === 'string' && query.trainingId.length > 0 ? query.trainingId : null
  const personnelId = typeof query.personnelId === 'string' && query.personnelId.length > 0 ? query.personnelId : null
  const trainingCategoryId = typeof query.trainingCategoryId === 'string' && query.trainingCategoryId.length > 0
    ? query.trainingCategoryId
    : null
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0 ? query.statusId : null

  if (!term && !trainingId && !personnelId && !trainingCategoryId && !statusId) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof SEARCHABLE_FIELDS => field in SEARCHABLE_FIELDS)
    : Object.keys(SEARCHABLE_FIELDS) as Array<keyof typeof SEARCHABLE_FIELDS>
  const filters = term ? selectedFields.map(field => `${SEARCHABLE_FIELDS[field]}.ilike.%${term}%`) : []

  if (term && filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  let trainingRecordQuery = supabase
    .from('training_records')
    .select(TRAINING_RECORD_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('training_title', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (filters.length > 0) {
    trainingRecordQuery = trainingRecordQuery.or(filters.join(','))
  }

  if (trainingId) {
    trainingRecordQuery = trainingRecordQuery.eq('training_id', trainingId)
  }

  if (personnelId) {
    trainingRecordQuery = trainingRecordQuery.eq('personnel_id', personnelId)
  }

  if (trainingCategoryId) {
    trainingRecordQuery = trainingRecordQuery.eq('training_category_id', trainingCategoryId)
  }

  if (statusId) {
    trainingRecordQuery = trainingRecordQuery.eq('status_id', statusId)
  }

  const { data, count, error } = await trainingRecordQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search training records: ${error.message}` })
  }

  const items = (data ?? []).map(mapTrainingRecordListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
