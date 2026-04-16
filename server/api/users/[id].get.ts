import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { UserProfileDetailResponse } from '../../shared/responses'
import { MANAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapUserProfileDetail } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { requireRouteId } from '../../shared/validations'

export default defineEventHandler(async (event): Promise<UserProfileDetailResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.userProfileManagement)

  const id = requireRouteId(getRouterParam(event, 'id'), 'User profile id is required.')

  const supabase = getServiceSupabaseClient()
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id, personnel_id, email, full_name, avatar_url, is_active, last_login_at, password_updated_at, created_at, updated_at, user_account_types!user_account_types_user_id_fkey(account_types(id, code, name))')
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
