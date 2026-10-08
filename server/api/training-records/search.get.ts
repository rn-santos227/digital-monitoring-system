import { createError, defineEventHandler, getQuery } from 'h3'
import type { TrainingRecordListResponse } from '../../shared/responses'
import { PERMISSION_CODES, TRAINING_RECORD_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { mapTrainingRecordListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validation'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchTrainingRecords } from '../../utils/training-records/searchTrainingRecords'
import { buildPersonnelAdvancedSearchFilters } from '../../utils/personnel/buildPersonnelAdvancedSearchFilters'

export default defineEventHandler(async (event): Promise<TrainingRecordListResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingManage)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions = typeof query.conditions === 'string' ? query.conditions : ''
  const trainingId = typeof query.trainingId === 'string' && query.trainingId.length > 0 ? query.trainingId : null
  const personnelId = typeof query.personnelId === 'string' && query.personnelId.length > 0 ? query.personnelId : null
  const trainingCategoryId = typeof query.trainingCategoryId === 'string' && query.trainingCategoryId.length > 0 ? query.trainingCategoryId : null
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0 ? query.statusId : null

  if (!term && !serializedConditions && !trainingId && !personnelId && !trainingCategoryId && !statusId) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({ page: query.page, pageSize: query.pageSize })
  const fields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
  const advancedFilters = buildPersonnelAdvancedSearchFilters(
    parsePersonnelAdvancedSearchConditions(serializedConditions),
    TRAINING_RECORD_SEARCHABLE_FIELD_COLUMNS,
  )
  if (serializedConditions && advancedFilters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid advanced search conditions were provided.' })
  }

  const { rows, totalItems } = await searchTrainingRecords(getServiceSupabaseClient(), {
    term,
    fields,
    advancedFilters,
    match: query.match === 'any' ? 'any' : 'all',
    trainingId,
    personnelId,
    trainingCategoryId,
    statusId,
    rangeFrom,
    rangeTo,
  })

  const response: TrainingRecordListResponse = {
    items: rows.map(mapTrainingRecordListItem),
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  }

  return response
})
