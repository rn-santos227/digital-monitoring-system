import { createError, defineEventHandler, getQuery } from 'h3'
import type { TrainingCategoryListResponse } from '../../shared/responses'
import { TRAINING_PERMISSION_GROUPS } from '../../shared/constants'
import { mapTrainingCategoryListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchTrainingCategories } from '../../utils/training-categories/searchTrainingCategories'

const SEARCHABLE_FIELDS = {
  code: 'code',
  name: 'name',
} as const

export default defineEventHandler(async (event): Promise<TrainingCategoryListResponse> => {
  await requireAnyPermission(event, TRAINING_PERMISSION_GROUPS.trainingManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''

  if (!term) {
    throw createError({ statusCode: 400, statusMessage: 'Search term is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof SEARCHABLE_FIELDS => field in SEARCHABLE_FIELDS)
    : Object.keys(SEARCHABLE_FIELDS) as Array<keyof typeof SEARCHABLE_FIELDS>

  const filters = selectedFields.map(field => `${SEARCHABLE_FIELDS[field]}.ilike.%${term}%`)

  if (filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await searchTrainingCategories(supabase, filters, rangeFrom, rangeTo)

  const items = rows.map(mapTrainingCategoryListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
