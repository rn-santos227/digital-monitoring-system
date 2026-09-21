import { createError } from 'h3'
import { EQUIPMENT_ISSUANCE_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { parseManagementPaginationQuery } from '../../shared/utils'
import { parseEquipmentAdvancedSearchConditions } from '../../shared/validations'
import { buildPersonnelAdvancedSearchFilters } from '../personnel/buildPersonnelAdvancedSearchFilters'

export const parseEquipmentIssuanceSearchQuery = (
  query: Record<string, unknown>,
) => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions =
    typeof query.conditions === 'string' ? query.conditions : ''
  const issuedToPersonnelId =
    typeof query.issuedToPersonnelId === 'string' && query.issuedToPersonnelId
      ? query.issuedToPersonnelId
      : null
  const statusId =
    typeof query.statusId === 'string' && query.statusId ? query.statusId : null
  const statusName =
    typeof query.statusName === 'string' && query.statusName
      ? query.statusName.trim()
      : null
  if (
    !term &&
    !serializedConditions &&
    !issuedToPersonnelId &&
    !statusId &&
    !statusName
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one search filter is required.',
    })
  }
  const pagination = parseManagementPaginationQuery(query)
  const rawFields =
    typeof query.fields === 'string'
      ? query.fields.split(',').map((field) => field.trim())
      : []
}
