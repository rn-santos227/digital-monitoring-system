import { createError } from 'h3'
import { EQUIPMENT_ASSET_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { parseManagementPaginationQuery } from '../../shared/utils'
import { parseEquipmentAdvancedSearchConditions } from '../../shared/validations'
import { buildPersonnelAdvancedSearchFilters } from '../personnel/buildPersonnelAdvancedSearchFilters'

export const parseEquipmentAssetSearchQuery = (
  query: Record<string, unknown>,
) => {
 const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions =
    typeof query.conditions === 'string' ? query.conditions : ''
  if (!term && !serializedConditions)
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one search filter is required.',
    })
  const pagination = parseManagementPaginationQuery(query)
  const rawFields =
    typeof query.fields === 'string'
      ? query.fields.split(',').map((field) => field.trim())
      : []
  const selectedFields = rawFields.length
    ? rawFields.filter(
        (
          field,
        ): field is keyof typeof EQUIPMENT_ASSET_SEARCHABLE_FIELD_COLUMNS =>
          field in EQUIPMENT_ASSET_SEARCHABLE_FIELD_COLUMNS,
      )
    : (Object.keys(EQUIPMENT_ASSET_SEARCHABLE_FIELD_COLUMNS) as Array<
        keyof typeof EQUIPMENT_ASSET_SEARCHABLE_FIELD_COLUMNS
      >)
  const searchFilters = term
    ? selectedFields.map(
        (field) =>
          `${EQUIPMENT_ASSET_SEARCHABLE_FIELD_COLUMNS[field]}.ilike.%${term}%`,
      )
    : []
  if (term && !searchFilters.length)
    throw createError({
      statusCode: 400,
      statusMessage: 'No valid searchable fields were provided.',
    })
  const advancedFilters = buildPersonnelAdvancedSearchFilters(
    parseEquipmentAdvancedSearchConditions(serializedConditions),
    EQUIPMENT_ASSET_SEARCHABLE_FIELD_COLUMNS,
  )
  if (serializedConditions && !advancedFilters.length)
    throw createError({
      statusCode: 400,
      statusMessage: 'No valid advanced search conditions were provided.',
    })
  return {
    ...pagination,
    searchFilters,
    advancedFilters,
    match: query.match === 'any' ? ('any' as const) : ('all' as const),
  }
}

