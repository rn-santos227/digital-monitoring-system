import {
  createError,
  defineEventHandler,
  getRouterParam,
  readBody,
} from 'h3'
import type { UpdateUserPasswordRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  USER_PROFILE_PASSWORD_SELECT_COLUMNS,
} from '../../../shared/constants'
import { parsePasswordUpdatePayload, requireRouteId } from '../../../shared/validation'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requireAuth } from '../../../utils/auth/requireAuth'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getUserProfileById } from '../../../utils/users/getUserProfileById'
import { updateUserPasswordById } from '../../../utils/users/updateUserPasswordById'
import { verifyCurrentUserPassword } from '../../../utils/users/verifyCurrentUserPassword'

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
  const targetProfile = await getUserProfileById<{ password_updated_at: string | null }>(
    supabase,
    id,
    USER_PROFILE_PASSWORD_SELECT_COLUMNS,
    'Failed to read user profile',
  )

  if (isSelfUpdate) {
    if (!currentPassword) {
      throw createError({ statusCode: 400, statusMessage: 'Current password is required when changing your own password.' })
    }

    await verifyCurrentUserPassword({
      supabase,
      email: user.email,
      currentPassword,
      userId: user.id,
    })
  }

  try {
    await updateUserPasswordById(supabase, id, newPassword)
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
