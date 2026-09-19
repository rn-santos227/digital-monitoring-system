import { createError } from 'h3'
import { DEPLOYMENT_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import type { DeploymentSearchQuery, ParsedDeploymentSearchQuery } from '../../shared/utils/deployment-management'
import { parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { buildPersonnelAdvancedSearchFilters } from '../personnel/buildPersonnelAdvancedSearchFilters'

export const parseDeploymentSearchQuery = (query: DeploymentSearchQuery): ParsedDeploymentSearchQuery => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions = typeof query.conditions === 'string' ? query.conditions : ''
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0 ? query.statusId : null

  if (!term && !serializedConditions && !statusId && !query.supervisorId) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery(query)
  const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
  const selectedFields = rawFields.length > 0
    ? rawFields.filter((field): field is keyof typeof DEPLOYMENT_SEARCHABLE_FIELD_COLUMNS => field in DEPLOYMENT_SEARCHABLE_FIELD_COLUMNS)
    : Object.keys(DEPLOYMENT_SEARCHABLE_FIELD_COLUMNS) as Array<keyof typeof DEPLOYMENT_SEARCHABLE_FIELD_COLUMNS>
  const filters = term ? selectedFields.map(field => `${DEPLOYMENT_SEARCHABLE_FIELD_COLUMNS[field]}.ilike.%${term}%`) : []
  if (term && filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  const advancedFilters = buildPersonnelAdvancedSearchFilters(
    parsePersonnelAdvancedSearchConditions(serializedConditions),
    DEPLOYMENT_SEARCHABLE_FIELD_COLUMNS,
  )
  if (serializedConditions && advancedFilters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid advanced search conditions were provided.' })
  }

  return {
    page,
    pageSize,
    filters,
    advancedFilters,
    match: query.match === 'any' ? 'any' : 'all',
    statusId,
    supervisorId: query.supervisorId,
    rangeFrom,
    rangeTo,
  }
}
