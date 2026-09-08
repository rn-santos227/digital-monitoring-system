import { createError, defineEventHandler, getQuery } from 'h3'
import type { AccountTypeListResponse } from '../../shared/models'
import { ACCOUNT_TYPE_SEARCHABLE_FIELD_COLUMNS, MANAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapAccountTypeListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { buildPersonnelAdvancedSearchFilters } from '../../utils/personnel/buildPersonnelAdvancedSearchFilters'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { searchAccountTypes } from '../../utils/account-types/searchAccountTypes'

export default defineEventHandler(async (event): Promise<AccountTypeListResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.accountTypeManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const serializedConditions = typeof query.conditions === 'string' ? query.conditions : ''
  const advancedFilters = buildPersonnelAdvancedSearchFilters(parsePersonnelAdvancedSearchConditions(serializedConditions), ACCOUNT_TYPE_SEARCHABLE_FIELD_COLUMNS)
  if (serializedConditions && advancedFilters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid advanced search conditions were provided.' })
  }
  const isSystem = query.isSystem === 'true' ? true : query.isSystem === 'false' ? false : null

  if (!term && !serializedConditions && typeof isSystem !== 'boolean') {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one search filter is required (term or isSystem).',
    })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const searchFilters: string[] = []

  if (term) {
    const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
    const selectedFields = rawFields.length > 0
      ? rawFields.filter((field): field is keyof typeof SEARCHABLE_ACCOUNT_TYPE_FIELDS => field in SEARCHABLE_ACCOUNT_TYPE_FIELDS)
      : Object.keys(SEARCHABLE_ACCOUNT_TYPE_FIELDS) as Array<keyof typeof SEARCHABLE_ACCOUNT_TYPE_FIELDS>

    for (const field of selectedFields) {
      searchFilters.push(`${SEARCHABLE_ACCOUNT_TYPE_FIELDS[field]}.ilike.%${term}%`)
    }

    if (searchFilters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided for this term.' })
    }
  }

  const supabase = getServiceSupabaseClient()
  const { rows, totalItems } = await searchAccountTypes(supabase, {
    searchFilters,
    isSystem,
    rangeFrom,
    rangeTo,
  })

  const items = rows.map(mapAccountTypeListItem)
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
  }
})
