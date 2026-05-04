import { defineEventHandler, getRouterParam } from 'h3'
import type { UserProfileDetailResponse } from '../../../shared/responses'
import { MANAGEMENT_PERMISSION_GROUPS, USER_PROFILE_DETAIL_SELECT_COLUMNS } from '../../../shared/constants'
import { mapUserProfileDetail } from '../../../shared/utils'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getUserProfileById } from '../../../utils/users/getUserProfileById'
import { requireRouteId } from '../../../shared/validations'

export default defineEventHandler(async (event): Promise<UserProfileDetailResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.userProfileManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'User profile id is required.')

  const supabase = getServiceSupabaseClient()
  const data = await getUserProfileById<Parameters<typeof mapUserProfileDetail>[0]>(
    supabase,
    id,
    USER_PROFILE_DETAIL_SELECT_COLUMNS,
    'Failed to fetch user profile details',
  )

  return mapUserProfileDetail(data)
})
