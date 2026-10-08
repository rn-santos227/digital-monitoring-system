import { createError, defineEventHandler, getQuery } from 'h3'
import type { TrainingListResponse } from '../../shared/responses'
import { TRAINING_PERMISSION_GROUPS, TRAINING_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { mapTrainingListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validation'
import { buildPersonnelAdvancedSearchFilters } from '../../utils/personnel/buildPersonnelAdvancedSearchFilters'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchTrainings } from '../../utils/trainings/searchTrainings'

export default defineEventHandler(async (event): Promise<TrainingListResponse> => {
  await requireAnyPermission(event, TRAINING_PERMISSION_GROUPS.trainingManagement)
  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
   const serializedConditions = typeof query.conditions === 'string' ? query.conditions : ''

  const trainingCategoryId = typeof query.trainingCategoryId === 'string' && query.trainingCategoryId.length > 0
    ? query.trainingCategoryId
    : null
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0
    ? query.statusId
    : null
  if (!term && !serializedConditions && !trainingCategoryId && !statusId) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  }
  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map((field) => field.trim()) : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof TRAINING_SEARCHABLE_FIELD_COLUMNS => field in TRAINING_SEARCHABLE_FIELD_COLUMNS)
    : Object.keys(TRAINING_SEARCHABLE_FIELD_COLUMNS) as Array<keyof typeof TRAINING_SEARCHABLE_FIELD_COLUMNS>
  const filters = term ? selectedFields.map((field) => `${TRAINING_SEARCHABLE_FIELD_COLUMNS[field]}.ilike.%${term}%`) : []
  if (term && filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }
  const advancedFilters = buildPersonnelAdvancedSearchFilters(
    parsePersonnelAdvancedSearchConditions(serializedConditions),
    TRAINING_SEARCHABLE_FIELD_COLUMNS,
  )
  if (serializedConditions && advancedFilters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid advanced search conditions were provided.' })
  }
  
  const { data, count } = await searchTrainings(getServiceSupabaseClient(), {
    filters,
    advancedFilters,
    match: query.match === 'any' ? 'any' : 'all',
    trainingCategoryId,
    statusId,
    rangeFrom,
    rangeTo,
  })
  const items = data.map(mapTrainingListItem)
  
  const totalItems = count
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
