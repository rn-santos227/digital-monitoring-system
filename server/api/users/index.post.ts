import { defineEventHandler, readBody } from 'h3'
import type { CreateUserProfileRequest } from '../../shared/requests'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../shared/constants'
import { parseCreateUserProfilePayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { createUserProfileWithAccountTypes } from '../../utils/users/createUserProfileWithAccountTypes'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.userCreate)
  const body = await readBody<CreateUserProfileRequest>(event)
  const payload = parseCreateUserProfilePayload(body)

  const supabase = getServiceSupabaseClient()
  let createdUserId: string | null = null

  try {
    await executeWithRollback({
      operation: async () => {
        createdUserId = await createUserProfileWithAccountTypes({
          supabase,
          payload,
          assignedByUserId: actor.id,
        })
      },
      rollback: async () => {
        if (!createdUserId) {
          return
        }

        const { error: deleteAuthUserError } = await supabase.auth.admin.deleteUser(createdUserId)

        if (deleteAuthUserError) {
          throw deleteAuthUserError
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback user profile create API changes.', rollbackError)
      },
    })

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.userProfileCreate,
      tableName: 'user_profiles',
      endpoint: AUDIT_LOG_ENDPOINTS.userProfilesCreate,
      recordId: createdUserId,
      requestData: {
        email: payload.email,
        personnelId: payload.personnelId,
        fullName: payload.fullName,
        avatarUrl: payload.avatarUrl,
        accountTypeIds: payload.accountTypeIds,
      },
      newData: {
        id: createdUserId,
        personnelId: payload.personnelId,
        email: payload.email,
        fullName: payload.fullName,
        avatarUrl: payload.avatarUrl,
        accountTypeIds: payload.accountTypeIds,
      },
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'User profile created successfully.',
    })

    return {
      ok: true,
      id: createdUserId,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.userProfileCreate,
      tableName: 'user_profiles',
      endpoint: AUDIT_LOG_ENDPOINTS.userProfilesCreate,
      requestData: {
        email: payload.email,
        personnelId: payload.personnelId,
        fullName: payload.fullName,
        avatarUrl: payload.avatarUrl,
        accountTypeIds: payload.accountTypeIds,
      },
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
