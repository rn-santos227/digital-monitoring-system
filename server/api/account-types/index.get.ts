import { defineEventHandler, getQuery } from 'h3'
import type { AccountTypeListResponse } from '../../shared/models'
import { MANAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapAccountTypeListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchAccountTypesList } from '../../utils/account-types/fetchAccountTypesList'

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
  const { rows, totalItems } = await fetchAccountTypesList(supabase, {
    search,
    includeSystem,
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
