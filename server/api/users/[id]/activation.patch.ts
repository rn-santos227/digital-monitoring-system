import { defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateUserActivationRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  USER_PROFILE_ACTIVATION_SELECT_COLUMNS,
} from '../../../shared/constants'
import { parseActivationPayload, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getUserProfileById } from '../../../utils/users/getUserProfileById'
import { updateUserActivationById } from '../../../utils/users/updateUserActivationById'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.userUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'User profile id is required.')
  const body = await readBody<UpdateUserActivationRequest>(event)
  const isActive = parseActivationPayload(body)

  const supabase = getServiceSupabaseClient()
  const existingProfile = await getUserProfileById<{ is_active: boolean }>(
    supabase,
    id,
    USER_PROFILE_ACTIVATION_SELECT_COLUMNS,
    'Failed to read existing user profile',
  )

  try {
    await executeWithRollback({
      operation: async () => {
        await updateUserActivationById(supabase, id, isActive)
      },
      rollback: async () => {
        await updateUserActivationById(supabase, id, existingProfile.is_active)
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback user activation patch API changes.', rollbackError)
      },
    })

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
