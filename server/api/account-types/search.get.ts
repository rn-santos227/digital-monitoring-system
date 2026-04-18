import { createError, defineEventHandler, getQuery } from 'h3'
import type { AccountTypeListResponse } from '../../shared/models'
import { ACCOUNT_TYPE_LIST_SELECT_COLUMNS, MANAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapAccountTypeListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_ACCOUNT_TYPE_FIELDS = {
  code: 'code',
  name: 'name',
  description: 'description',
} as const

export default defineEventHandler(async (event): Promise<AccountTypeListResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.accountTypeManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const isSystem = query.isSystem === 'true' ? true : query.isSystem === 'false' ? false : null

  if (!term && typeof isSystem !== 'boolean') {
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
  let accountTypeQuery = supabase
    .from('account_types')
    .select(ACCOUNT_TYPE_LIST_SELECT_COLUMNS, {
      count: 'exact',
    })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (searchFilters.length > 0) {
    accountTypeQuery = accountTypeQuery.or(searchFilters.join(','))
  }

  if (typeof isSystem === 'boolean') {
    accountTypeQuery = accountTypeQuery.eq('is_system', isSystem)
  }

  const { data, count, error } = await accountTypeQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search account types: ${error.message}` })
  }

  const items = (data ?? []).map(mapAccountTypeListItem)
  const totalItems = count ?? 0
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
  }
})
