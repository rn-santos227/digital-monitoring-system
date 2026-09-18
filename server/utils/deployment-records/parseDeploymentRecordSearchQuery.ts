import { createError } from 'h3'
import { DEPLOYMENT_RECORD_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import type { DeploymentSearchQuery, ParsedDeploymentRecordSearchQuery } from '../../shared/utils/deployment-management'
import { parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { buildPersonnelAdvancedSearchFilters } from '../personnel/buildPersonnelAdvancedSearchFilters'

export const parseDeploymentRecordSearchQuery = (query: DeploymentSearchQuery & { personnelId?: unknown }): ParsedDeploymentRecordSearchQuery => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions = typeof query.conditions === 'string' ? query.conditions : ''
  const personnelId = typeof query.personnelId === 'string' && query.personnelId.length > 0 ? query.personnelId : null
  const statusId = typeof query.statusId === 'string' && query.statusId.length > 0 ? query.statusId : null
  const supervisorId = typeof query.supervisorId === 'string' && query.supervisorId.length > 0 ? query.supervisorId : null

  if (!term && !serializedConditions && !personnelId && !statusId && !supervisorId) {
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required.' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery(query)
  const fields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
  const advancedFilters = buildPersonnelAdvancedSearchFilters(
    parsePersonnelAdvancedSearchConditions(serializedConditions),
    DEPLOYMENT_RECORD_SEARCHABLE_FIELD_COLUMNS,
  )
  if (serializedConditions && advancedFilters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid advanced search conditions were provided.' })
  }

  return {
    page,
    pageSize,
    term,
    fields,
    advancedFilters,
    match: query.match === 'any' ? 'any' : 'all',
    personnelId,
    statusId,
    supervisorId,
    rangeFrom,
    rangeTo,
  }
}
