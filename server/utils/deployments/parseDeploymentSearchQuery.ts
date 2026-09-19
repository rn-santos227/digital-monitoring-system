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
}
