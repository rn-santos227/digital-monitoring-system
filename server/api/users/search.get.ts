import { createError, defineEventHandler, getQuery } from 'h3'
import type { UserProfileListCompactResponse } from '../../shared/responses'
import { MANAGEMENT_PERMISSION_GROUPS, USER_PROFILE_COMPACT_SELECT_COLUMNS } from '../../shared/constants'
import { mapUserProfileCompactListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_USER_PROFILE_FIELDS = {
  email: 'email',
  fullName: 'full_name',
} as const

export default defineEventHandler(async (event): Promise<UserProfileListCompactResponse> => {
  const actor = await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.userProfileManagement)

  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const isActive = query.isActive === 'true' ? true : query.isActive === 'false' ? false : null

  if (!term && typeof isActive !== 'boolean') {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one search filter is required (term or isActive).',
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
      ? rawFields.filter((field): field is keyof typeof SEARCHABLE_USER_PROFILE_FIELDS => field in SEARCHABLE_USER_PROFILE_FIELDS)
      : Object.keys(SEARCHABLE_USER_PROFILE_FIELDS) as Array<keyof typeof SEARCHABLE_USER_PROFILE_FIELDS>

    for (const field of selectedFields) {
      searchFilters.push(`${SEARCHABLE_USER_PROFILE_FIELDS[field]}.ilike.%${term}%`)
    }

    if (searchFilters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided for this term.' })
    }
  }

  const supabase = getServiceSupabaseClient()
  let profileQuery = supabase
    .from('user_profiles')
    .select(USER_PROFILE_COMPACT_SELECT_COLUMNS, {
      count: 'exact',
    })
    .neq('id', actor.id)
    .order('full_name', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (searchFilters.length > 0) {
    profileQuery = profileQuery.or(searchFilters.join(','))
  }

  if (typeof isActive === 'boolean') {
    profileQuery = profileQuery.eq('is_active', isActive)
  }

  const { data, count, error } = await profileQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search user profiles: ${error.message}` })
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
