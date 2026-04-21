import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateUserProfileRequest } from '../../shared/requests'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  ID_ONLY_SELECT_COLUMNS,
  USER_PROFILE_PERSONNEL_LOOKUP_SELECT_COLUMNS,
  PERMISSION_CODES,
} from '../../shared/constants'
import { parseCreateUserProfilePayload } from '../../shared/validations'
import { assertPersonnelExists, buildAssignedPersonnelProfileMap } from '../../shared/utils'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.userCreate)
  const body = await readBody<CreateUserProfileRequest>(event)
  const payload = parseCreateUserProfilePayload(body)

  const supabase = getServiceSupabaseClient()
  let createdUserId: string | null = null

  try {
    await executeWithRollback({
      operation: async () => {
        if (payload.personnelId) {
          await assertPersonnelExists({
            supabase,
            personnelId: payload.personnelId,
            idSelectColumns: ID_ONLY_SELECT_COLUMNS,
          })

          const { data: assignedProfiles, error: assignedProfilesError } = await supabase
            .from('user_profiles')
            .select(USER_PROFILE_PERSONNEL_LOOKUP_SELECT_COLUMNS)
            .eq('personnel_id', payload.personnelId)

          if (assignedProfilesError) {
            throw createError({ statusCode: 500, statusMessage: `Failed to validate personnel assignment: ${assignedProfilesError.message}` })
          }

          const assignedByPersonnelId = buildAssignedPersonnelProfileMap(assignedProfiles ?? [])

          if (assignedByPersonnelId.has(payload.personnelId)) {
            throw createError({ statusCode: 409, statusMessage: 'Selected personnel is already assigned to another user profile.' })
          }
        }

        const { data: createdAuthUser, error: createAuthUserError } = await supabase.auth.admin.createUser({
          email: payload.email,
          password: payload.password,
          email_confirm: true,
          user_metadata: {
            full_name: payload.fullName,
          },
        })

        if (createAuthUserError || !createdAuthUser.user?.id) {
          throw createError({ statusCode: 500, statusMessage: `Failed to create auth user: ${createAuthUserError?.message ?? 'Missing auth user id.'}` })
        }

        createdUserId = createdAuthUser.user.id

        const { error: profileInsertError } = await supabase
          .from('user_profiles')
          .insert({
            id: createdUserId,
            personnel_id: payload.personnelId,
            email: payload.email,
            full_name: payload.fullName,
            avatar_url: payload.avatarUrl,
          })

        if (profileInsertError) {
          throw createError({ statusCode: 500, statusMessage: `Failed to create user profile: ${profileInsertError.message}` })
        }

        if (payload.accountTypeIds.length > 0) {
          const { data: accountTypeMatches, error: accountTypeLookupError } = await supabase
            .from('account_types')
            .select(ID_ONLY_SELECT_COLUMNS)
            .in('id', payload.accountTypeIds)

          if (accountTypeLookupError) {
            throw createError({ statusCode: 500, statusMessage: `Failed to validate account types: ${accountTypeLookupError.message}` })
          }

          if ((accountTypeMatches ?? []).length !== payload.accountTypeIds.length) {
            throw createError({ statusCode: 400, statusMessage: 'One or more account type ids are invalid.' })
          }

          const { error: userAccountTypesError } = await supabase
            .from('user_account_types')
            .insert(payload.accountTypeIds.map((accountTypeId) => ({
              user_id: createdUserId,
              account_type_id: accountTypeId,
              assigned_by: actor.id,
            })))

          if (userAccountTypesError) {
            throw createError({ statusCode: 500, statusMessage: `Failed to assign user account types: ${userAccountTypesError.message}` })
          }
        }

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
