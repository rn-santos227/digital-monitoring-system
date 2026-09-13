import { createError, defineEventHandler, getQuery } from 'h3'
import type { TrainingCategoryListResponse } from '../../shared/responses'
import { TRAINING_CATEGORY_SEARCHABLE_FIELD_COLUMNS, TRAINING_PERMISSION_GROUPS } from '../../shared/constants'
import { mapTrainingCategoryListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchTrainingCategories } from '../../utils/training-categories/searchTrainingCategories'
import { buildPersonnelAdvancedSearchFilters } from '../../utils/personnel/buildPersonnelAdvancedSearchFilters'

export default defineEventHandler(async (event): Promise<TrainingCategoryListResponse> => {
  await requireAnyPermission(event, TRAINING_PERMISSION_GROUPS.trainingManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions = typeof query.conditions === 'string' ? query.conditions : ''

  if (!term && !serializedConditions) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof TRAINING_CATEGORY_SEARCHABLE_FIELD_COLUMNS => field in TRAINING_CATEGORY_SEARCHABLE_FIELD_COLUMNS)
    : Object.keys(TRAINING_CATEGORY_SEARCHABLE_FIELD_COLUMNS) as Array<keyof typeof TRAINING_CATEGORY_SEARCHABLE_FIELD_COLUMNS>

  const filters = term
    ? selectedFields.map(field => `${TRAINING_CATEGORY_SEARCHABLE_FIELD_COLUMNS[field]}.ilike.%${term}%`)
    : []

  if (term && filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await searchTrainingCategories(supabase, filters, rangeFrom, rangeTo)

  const items = rows.map(mapTrainingCategoryListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
