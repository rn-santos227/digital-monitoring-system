import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { UserProfileDetailResponse } from '../../../shared/responses'
import { MANAGEMENT_PERMISSION_GROUPS, USER_PROFILE_DETAIL_SELECT_COLUMNS } from '../../../shared/constants'
import { mapUserProfileDetail } from '../../../shared/utils'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { requireRouteId } from '../../../shared/validations'

export default defineEventHandler(async (event): Promise<UserProfileDetailResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.userProfileManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'User profile id is required.')

  const supabase = getServiceSupabaseClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select(USER_PROFILE_DETAIL_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch user profile details: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'User profile not found.' })
  }

  return mapUserProfileDetail(data)
})
