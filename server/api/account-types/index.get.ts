import { createError, defineEventHandler, getQuery } from 'h3'
import type { AccountTypeListResponse } from '../../shared/models'
import { ACCOUNT_TYPE_LIST_SELECT_COLUMNS, MANAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapAccountTypeListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<AccountTypeListResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.accountTypeManagement)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const includeSystem = query.includeSystem === 'false' ? false : true

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  let accountTypeQuery = supabase
    .from('account_types')
    .select(ACCOUNT_TYPE_LIST_SELECT_COLUMNS, {
      count: 'exact',
    })
    .order('name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    accountTypeQuery = accountTypeQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`)
  }

  if (!includeSystem) {
    accountTypeQuery = accountTypeQuery.eq('is_system', false)
  }

  const { data, count, error } = await accountTypeQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch account types: ${error.message}` })
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
