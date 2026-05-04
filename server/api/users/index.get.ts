import { defineEventHandler, getQuery } from 'h3'
import type { UserProfileListCompactResponse } from '../../shared/responses'
import { MANAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapUserProfileCompactListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchUserProfilesList } from '../../utils/users/fetchUserProfilesList'

export default defineEventHandler(async (event): Promise<UserProfileListCompactResponse> => {
  const actor = await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.userProfileManagement)

  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const isActive = query.isActive === 'true' ? true : query.isActive === 'false' ? false : null

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  const supabase = getServiceSupabaseClient()
  const { data, count } = await fetchUserProfilesList<Parameters<typeof mapUserProfileCompactListItem>[0]>({
    actorId: actor.id,
    rangeFrom,
    rangeTo,
    term: search,
    isActive,
  })

  const items = data.map(mapUserProfileCompactListItem)
  const totalItems = count
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
  }
})
