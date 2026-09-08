import { createError, defineEventHandler, getQuery } from 'h3'
import type { UserProfileListCompactResponse } from '../../shared/responses'
import { MANAGEMENT_PERMISSION_GROUPS, USER_PROFILE_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { mapUserProfileCompactListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { parsePersonnelAdvancedSearchConditions } from '../../shared/validations'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'


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
    throw createError({ statusCode: 400, statusMessage: 'At least one search filter is required (term or isActive).' })
  }

  const { page, pageSize, rangeFrom, rangeTo } = parseManagementPaginationQuery({
    page: query.page,
    pageSize: query.pageSize,
  })

  let selectedFields: Array<keyof typeof SEARCHABLE_USER_PROFILE_FIELDS> = []

  if (term) {
    const rawFields = typeof query.fields === 'string' ? query.fields.split(',').map(field => field.trim()) : []
    selectedFields = rawFields.length > 0
      ? rawFields.filter((field): field is keyof typeof SEARCHABLE_USER_PROFILE_FIELDS => field in SEARCHABLE_USER_PROFILE_FIELDS)
      : Object.keys(SEARCHABLE_USER_PROFILE_FIELDS) as Array<keyof typeof SEARCHABLE_USER_PROFILE_FIELDS>

    if (selectedFields.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided for this term.' })
    }
  }

  const supabase = getServiceSupabaseClient()
  const { data, count } = await fetchUserProfilesList<Parameters<typeof mapUserProfileCompactListItem>[0]>({
    actorId: actor.id,
    rangeFrom,
    rangeTo,
    term,
    isActive,
    searchFields: selectedFields.map((field) => SEARCHABLE_USER_PROFILE_FIELDS[field]),
  })

  const items = data.map(mapUserProfileCompactListItem)
  const totalItems = count
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)

  return { items, page, pageSize, totalItems, totalPages }
})
