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
}
