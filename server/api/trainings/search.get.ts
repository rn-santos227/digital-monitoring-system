import { createError, defineEventHandler, getQuery } from 'h3'
import type { TrainingListResponse } from '../../shared/responses'
import { TRAINING_PERMISSION_GROUPS, TRAINING_SELECT_COLUMNS } from '../../shared/constants'
import { mapTrainingListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_FIELDS = {
  trainingTitle: 'training_title',
  defaultRemarks: 'default_remarks',
} as const

export default defineEventHandler(async (event): Promise<TrainingListResponse> => {
  await requireAnyPermission(event, TRAINING_PERMISSION_GROUPS.trainingManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const trainingCategoryId = typeof query.trainingCategoryId === 'string' && query.trainingCategoryId.length > 0
    ? query.trainingCategoryId
    : null
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0
    ? query.statusId
    : null

  if (!term && !trainingCategoryId && !statusId) {
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
  let trainingQuery = supabase
    .from('trainings')
    .select(TRAINING_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('training_title', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (filters.length > 0) {
    trainingQuery = trainingQuery.or(filters.join(','))
  }

  if (trainingCategoryId) {
    trainingQuery = trainingQuery.eq('training_category_id', trainingCategoryId)
  }

  if (statusId) {
    trainingQuery = trainingQuery.eq('status_id', statusId)
  }

  const { data, count, error } = await trainingQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search trainings: ${error.message}` })
  }

  const items = (data ?? []).map(mapTrainingListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
