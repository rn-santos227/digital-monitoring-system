import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateUserProfileRequest } from '../../shared/requests'
import type { MutationSuccessResponse } from '../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../shared/constants'
import { buildUserProfileUpdates, normalizeAccountTypeIds, requireRouteId } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.userUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'User profile id is required.')
  const body = await readBody<UpdateUserProfileRequest>(event)

  if ('isActive' in (body as Record<string, unknown>)) {
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

  const supabase = getServiceSupabaseClient()

  const { data: existingProfile, error: existingProfileError } = await supabase
    .from('user_profiles')
    .select('id, personnel_id, email, full_name, avatar_url, is_active, updated_at')
    .eq('id', id)
    .maybeSingle()

  if (existingProfileError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read existing user profile: ${existingProfileError.message}` })
  }

  if (!existingProfile) {
    throw createError({ statusCode: 404, statusMessage: 'User profile not found.' })
  }

  const { data: existingAccountTypeRows, error: existingAccountTypesError } = await supabase
    .from('user_account_types')
    .select('account_type_id')
    .eq('user_id', id)

  if (existingAccountTypesError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read existing account type assignments: ${existingAccountTypesError.message}` })
  }

  const existingAccountTypeIds = (existingAccountTypeRows ?? []).map(row => row.account_type_id)

  try {
    await executeWithRollback({
      operation: async () => {
        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', id)

          if (updateError) {
            throw createError({ statusCode: 500, statusMessage: `Failed to update user profile: ${updateError.message}` })
          }
        }

        if (accountTypeIds !== null) {
          await requirePermission(event, PERMISSION_CODES.accountTypeUpdate)

          const { data: accountTypeMatches, error: accountTypeLookupError } = await supabase
            .from('account_types')
            .select('id')
            .in('id', accountTypeIds)

          if (accountTypeLookupError) {
            throw createError({ statusCode: 500, statusMessage: `Failed to validate account types: ${accountTypeLookupError.message}` })
          }

          if ((accountTypeMatches ?? []).length !== accountTypeIds.length) {
            throw createError({ statusCode: 400, statusMessage: 'One or more account type ids are invalid.' })
          }

          const { error: clearAssignmentsError } = await supabase
            .from('user_account_types')
            .delete()
            .eq('user_id', id)

          if (clearAssignmentsError) {
            throw createError({ statusCode: 500, statusMessage: `Failed to clear account type assignments: ${clearAssignmentsError.message}` })
          }

          if (accountTypeIds.length > 0) {
            const { error: assignError } = await supabase
              .from('user_account_types')
              .insert(accountTypeIds.map((accountTypeId: string) => ({
                user_id: id,
                account_type_id: accountTypeId,
              })))

            if (assignError) {
              throw createError({ statusCode: 500, statusMessage: `Failed to assign account types: ${assignError.message}` })
            }
          }
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

    const { data: updatedProfile } = await supabase
      .from('user_profiles')
      .select('id, personnel_id, email, full_name, avatar_url, is_active, updated_at')
      .eq('id', id)
      .maybeSingle()

    const { data: updatedAccountTypeRows } = await supabase
      .from('user_account_types')
      .select('account_type_id')
      .eq('user_id', id)

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
        ...(updatedProfile ?? existingProfile),
        accountTypeIds: (updatedAccountTypeRows ?? []).map(row => row.account_type_id),
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
