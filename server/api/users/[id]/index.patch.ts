import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateUserProfileRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  USER_PROFILE_SUMMARY_SELECT_COLUMNS,
} from '../../../shared/constants'
import { buildUserProfileUpdates, normalizeAccountTypeIds, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requireAuth } from '../../../utils/auth/requireAuth'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getUserAccountTypeIdsByUserId } from '../../../utils/users/getUserAccountTypeIdsByUserId'
import { getUserProfileById } from '../../../utils/users/getUserProfileById'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { replaceUserAccountTypes } from '../../../utils/users/replaceUserAccountTypes'
import { updateUserProfileFieldsById } from '../../../utils/users/updateUserProfileFieldsById'
import { updateUserEmailById } from '../../../utils/users/updateUserEmailById'
import { validateUserPersonnelAssignment } from '../../../utils/users/validateUserPersonnelAssignment'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requireAuth(event)
  const id = requireRouteId(getRouterParam(event, 'id'), 'User profile id is required.')
  const body = await readBody<UpdateUserProfileRequest>(event)
  const isSelfUpdate = actor.id === id
  const canUpdateUsers = actor.permission_codes.includes(PERMISSION_CODES.userUpdate)

  if (!isSelfUpdate && !canUpdateUsers) {
    throw createError({ statusCode: 403, statusMessage: `Missing required permission: ${PERMISSION_CODES.userUpdate}` })
  }

  if (isSelfUpdate && !canUpdateUsers && (body.personnelId !== undefined || body.accountTypeIds !== undefined)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You can only update your own email, full name, avatar, and password without user management privileges.',
    })
  }

  if (typeof body.isActive !== 'undefined') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Use PATCH /api/users/:id/activation to activate or deactivate a user profile.',
    })
  }

  const updates = buildUserProfileUpdates(body)
  const accountTypeIds = normalizeAccountTypeIds(body.accountTypeIds)

  if (Object.keys(updates).length === 0 && accountTypeIds === null) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  if (accountTypeIds !== null && accountTypeIds.length !== 1) {
    throw createError({ statusCode: 400, statusMessage: 'Select exactly one account type.' })
  }

  const supabase = getServiceSupabaseClient()
  const existingProfile = await getUserProfileById<{
    personnel_id: string | null
    full_name: string
    avatar_url: string | null
  }>(supabase, id, USER_PROFILE_SUMMARY_SELECT_COLUMNS, 'Failed to read existing user profile')

  const existingAccountTypeIds = await getUserAccountTypeIdsByUserId(supabase, id)

  try {
    await executeWithRollback({
      operation: async () => {
        if (updates.personnel_id) {
          await validateUserPersonnelAssignment({
            supabase,
            personnelId: updates.personnel_id,
            currentUserId: id,
          })
        }

        if (Object.keys(updates).length > 0) {
          await updateUserProfileFieldsById(supabase, id, updates)
        }

        if (accountTypeIds !== null) {
          await requirePermission(event, PERMISSION_CODES.accountTypeUpdate)
          await replaceUserAccountTypes({
            supabase,
            userId: id,
            accountTypeIds,
          })
        }
      },
      rollback: async () => {
        const { error: profileRollbackError } = await supabase
          .from('user_profiles')
          .update({
            personnel_id: existingProfile.personnel_id,
            full_name: existingProfile.full_name,
            avatar_url: existingProfile.avatar_url,
          })
          .eq('id', id)

        if (profileRollbackError) {
          throw profileRollbackError
        }

        const { error: clearAssignmentsError } = await supabase
          .from('user_account_types')
          .delete()
          .eq('user_id', id)

        if (clearAssignmentsError) {
          throw clearAssignmentsError
        }

        if (existingAccountTypeIds.length > 0) {
          const { error: restoreAccountTypesError } = await supabase
            .from('user_account_types')
            .insert(existingAccountTypeIds.map(accountTypeId => ({
              user_id: id,
              account_type_id: accountTypeId,
            })))

          if (restoreAccountTypesError) {
            throw restoreAccountTypesError
          }
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback user profile patch API changes.', rollbackError)
      },
    })

    const updatedProfile = await getUserProfileById<{
      personnel_id: string | null
      full_name: string
      avatar_url: string | null
    }>(supabase, id, USER_PROFILE_SUMMARY_SELECT_COLUMNS, 'Failed to read updated user profile')
    const updatedAccountTypeIds = await getUserAccountTypeIdsByUserId(supabase, id)
  
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.userProfileUpdate,
      tableName: 'user_profiles',
      endpoint: AUDIT_LOG_ENDPOINTS.userProfilesUpdate,
      recordId: id,
      requestData: {
        updates,
        accountTypeIds,
      },
      oldData: {
        ...existingProfile,
        accountTypeIds: existingAccountTypeIds,
      },
      newData: {
        ...updatedProfile,
        accountTypeIds: updatedAccountTypeIds,
      },
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'User profile updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.userProfileUpdate,
      tableName: 'user_profiles',
      endpoint: AUDIT_LOG_ENDPOINTS.userProfilesUpdate,
      recordId: id,
      requestData: {
        updates,
        accountTypeIds,
      },
      oldData: {
        ...existingProfile,
        accountTypeIds: existingAccountTypeIds,
      },
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
