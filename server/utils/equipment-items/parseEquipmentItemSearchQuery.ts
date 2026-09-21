import { createError } from 'h3'
import { EQUIPMENT_ITEM_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { parseManagementPaginationQuery } from '../../shared/utils'
import { parseEquipmentAdvancedSearchConditions } from '../../shared/validations'
import { buildPersonnelAdvancedSearchFilters } from '../personnel/buildPersonnelAdvancedSearchFilters'

export const parseEquipmentItemSearchQuery = (
  query: Record<string, unknown>,
) => {

}
