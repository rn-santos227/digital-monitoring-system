import { createError } from 'h3'
import { EQUIPMENT_CATEGORY_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { parseManagementPaginationQuery } from '../../shared/utils'
import { parseEquipmentAdvancedSearchConditions } from '../../shared/validations'
import { buildPersonnelAdvancedSearchFilters } from '../personnel/buildPersonnelAdvancedSearchFilters'

export const parseEquipmentCategorySearchQuery = (
  query: Record<string, unknown>,
) => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions =
    typeof query.conditions === 'string' ? query.conditions : ''
  const isActive =
    query.isActive === 'true' ? true : query.isActive === 'false' ? false : null
  if (!term && !serializedConditions && typeof isActive !== 'boolean') {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one search filter is required.',
    })
  }


}
