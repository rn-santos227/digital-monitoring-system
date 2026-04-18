import { createError, defineEventHandler, getRouterParam } from 'h3'
import {
  ACCOUNT_TYPE_ASSIGNED_USER_COUNT_SELECT_COLUMNS,
  ACCOUNT_TYPE_BASE_SELECT_COLUMNS,
  ACCOUNT_TYPE_PERMISSION_ID_SELECT_COLUMNS,
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.accountTypeDelete)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Account type id is required.' })
  }

  const supabase = getServiceSupabaseClient()

  const { data: existingAccountType, error: existingAccountTypeError } = await supabase
    .from('account_types')
    .select(ACCOUNT_TYPE_BASE_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (existingAccountTypeError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read account type: ${existingAccountTypeError.message}` })
  }

  if (!existingAccountType) {
    throw createError({ statusCode: 404, statusMessage: 'Account type not found.' })
  }

  const { count: assignedActiveUserCount, error: assignedUserCountError } = await supabase
    .from('user_account_types')
   .select(ACCOUNT_TYPE_ASSIGNED_USER_COUNT_SELECT_COLUMNS, { count: 'exact', head: true })
    .eq('account_type_id', id)
    .eq('user_profiles.is_active', true)

  if (assignedUserCountError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to validate account type usage: ${assignedUserCountError.message}` })
  }

  if ((assignedActiveUserCount ?? 0) > 0) {
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.accountTypeDelete,
      tableName: 'account_types',
      endpoint: AUDIT_LOG_ENDPOINTS.accountTypesDelete,
      recordId: id,
      oldData: existingAccountType,
      statusCode: 409,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message: 'Account type cannot be deleted because it is assigned to active user profiles.',
    })

    throw createError({
      statusCode: 409,
      statusMessage: 'Account type cannot be deleted because it is assigned to active user profiles.',
    })
  }

  const { data: existingPermissionRows, error: existingPermissionsError } = await supabase
    .from('account_type_permissions')
    .select(ACCOUNT_TYPE_PERMISSION_ID_SELECT_COLUMNS)
    .eq('account_type_id', id)

  if (existingPermissionsError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read existing account type permissions: ${existingPermissionsError.message}` })
  }

  const existingPermissionIds = (existingPermissionRows ?? []).map(row => row.permission_id)

  try {
    await executeWithRollback({
      operation: async () => {
        const { error: deletePermissionsError } = await supabase
          .from('account_type_permissions')
          .delete()
          .eq('account_type_id', id)

        if (deletePermissionsError) {
          throw createError({ statusCode: 500, statusMessage: `Failed to delete account type permissions: ${deletePermissionsError.message}` })
        }

        const { error: deleteAccountTypeError } = await supabase
          .from('account_types')
          .delete()
          .eq('id', id)

        if (deleteAccountTypeError) {
          throw createError({ statusCode: 500, statusMessage: `Failed to delete account type: ${deleteAccountTypeError.message}` })
        }
      },
      rollback: async () => {
        const { error: restoreAccountTypeError } = await supabase
          .from('account_types')
          .insert({
            id: existingAccountType.id,
            code: existingAccountType.code,
            name: existingAccountType.name,
            description: existingAccountType.description,
            is_system: existingAccountType.is_system,
            created_at: existingAccountType.created_at,
            updated_at: existingAccountType.updated_at,
          })

        if (restoreAccountTypeError) {
          throw restoreAccountTypeError
        }

        if (existingPermissionIds.length > 0) {
          const { error: restorePermissionsError } = await supabase
            .from('account_type_permissions')
            .insert(existingPermissionIds.map(permissionId => ({
              account_type_id: id,
              permission_id: permissionId,
            })))

          if (restorePermissionsError) {
            throw restorePermissionsError
          }
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback account type delete API changes.', rollbackError)
      },
    })

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.accountTypeDelete,
      tableName: 'account_types',
      endpoint: AUDIT_LOG_ENDPOINTS.accountTypesDelete,
      recordId: id,
      oldData: {
        ...existingAccountType,
        permissionIds: existingPermissionIds,
      },
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Account type deleted successfully.',
    })

    return {
      ok: true,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.accountTypeDelete,
      tableName: 'account_types',
      endpoint: AUDIT_LOG_ENDPOINTS.accountTypesDelete,
      recordId: id,
      oldData: {
        ...existingAccountType,
        permissionIds: existingPermissionIds,
      },
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
