import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateUserPasswordRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  USER_PROFILE_PASSWORD_SELECT_COLUMNS,
} from '../../../shared/constants'
import { parsePasswordUpdatePayload, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requireAuth } from '../../../utils/auth/requireAuth'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const user = await requireAuth(event)
  const id = requireRouteId(getRouterParam(event, 'id'), 'User profile id is required.')
  const body = await readBody<UpdateUserPasswordRequest>(event)
  const { currentPassword, newPassword } = parsePasswordUpdatePayload(body)
  const isSelfUpdate = user.id === id

  if (!isSelfUpdate) {
    await requirePermission(event, PERMISSION_CODES.userUpdate)
  }

  const supabase = getServiceSupabaseClient()

  const { data: targetProfile, error: targetProfileError } = await supabase
    .from('user_profiles')
    .select(USER_PROFILE_PASSWORD_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (targetProfileError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read user profile: ${targetProfileError.message}` })
  }

  if (!targetProfile) {
    throw createError({ statusCode: 404, statusMessage: 'User profile not found.' })
  }

  if (isSelfUpdate) {
    if (!currentPassword) {
      throw createError({ statusCode: 400, statusMessage: 'Current password is required when changing your own password.' })
    }

    const { data: authData, error: authError } = await supabase.rpc('authenticate_local_user', {
      p_email: user.email,
      p_password: currentPassword,
    })

    if (authError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to verify current password: ${authError.message}` })
    }

    const authenticatedUser = authData?.[0]
    if (!authenticatedUser || authenticatedUser.user_id !== user.id) {
      throw createError({ statusCode: 401, statusMessage: 'Current password is invalid.' })
    }
  }

  try {
    const { error: passwordError } = await supabase.rpc('set_user_profile_password', {
      p_user_id: id,
      p_password: newPassword,
    })

    if (passwordError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to update password: ${passwordError.message}` })
    }

    await recordManagementAuditLog(event, {
      userId: user.id,
      action: AUDIT_LOG_ACTIONS.userProfileUpdate,
      tableName: 'user_profiles',
      endpoint: AUDIT_LOG_ENDPOINTS.userProfilesPasswordUpdate,
      recordId: id,
      requestData: {
        isSelfUpdate,
        hasCurrentPassword: Boolean(currentPassword),
      },
      oldData: {
        passwordUpdatedAt: targetProfile.password_updated_at,
      },
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'User password updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: user.id,
      action: AUDIT_LOG_ACTIONS.userProfileUpdate,
      tableName: 'user_profiles',
      endpoint: AUDIT_LOG_ENDPOINTS.userProfilesPasswordUpdate,
      recordId: id,
      requestData: {
        isSelfUpdate,
        hasCurrentPassword: Boolean(currentPassword),
      },
      oldData: {
        passwordUpdatedAt: targetProfile.password_updated_at,
      },
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
