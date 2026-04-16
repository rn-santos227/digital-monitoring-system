import { createError, defineEventHandler, getQuery } from 'h3'
import type { UserProfileListCompactResponse } from '../../shared/responses'
import { MANAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapUserProfileCompactListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<UserProfileListCompactResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.userProfileManagement)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const isActive = query.isActive === 'true' ? true : query.isActive === 'false' ? false : null

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  let profileQuery = supabase
    .from('user_profiles')
    .select('id, email, full_name, is_active, last_login_at, user_account_types(account_types(code))', {
      count: 'exact',
    })
    .order('full_name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (search) {
    profileQuery = profileQuery.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
  }

  if (typeof isActive === 'boolean') {
    profileQuery = profileQuery.eq('is_active', isActive)
  }

  const { data, count, error } = await profileQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch user profiles: ${error.message}` })
  }

  const items = (data ?? []).map(mapUserProfileCompactListItem)
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