import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateUserActivationRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { parseActivationPayload, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.userUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'User profile id is required.')
  const body = await readBody<UpdateUserActivationRequest>(event)
  const isActive = parseActivationPayload(body)

  const supabase = getServiceSupabaseClient()
  const { data: existingProfile, error: existingProfileError } = await supabase
    .from('user_profiles')
    .select('id, email, full_name, is_active')
    .eq('id', id)
    .maybeSingle()

  if (existingProfileError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read existing user profile: ${existingProfileError.message}` })
  }

  if (!existingProfile) {
    throw createError({ statusCode: 404, statusMessage: 'User profile not found.' })
  }

  try {
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ is_active: isActive })
      .eq('id', id)

    if (updateError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to update user activation state: ${updateError.message}` })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.userProfileUpdate,
      tableName: 'user_profiles',
      endpoint: AUDIT_LOG_ENDPOINTS.userProfilesActivationUpdate,
      recordId: id,
      requestData: { isActive },
      oldData: { isActive: existingProfile.is_active },
      newData: { isActive },
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: `User profile ${isActive ? 'activated' : 'deactivated'} successfully.`,
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.userProfileUpdate,
      tableName: 'user_profiles',
      endpoint: AUDIT_LOG_ENDPOINTS.userProfilesActivationUpdate,
      recordId: id,
      requestData: { isActive },
      oldData: { isActive: existingProfile.is_active },
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
