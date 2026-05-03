import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateAccountTypeRequest } from '../../../shared/requests'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { normalizeOptionalText } from '../../../shared/utils'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getAccountTypeById } from '../../../utils/account-types/getAccountTypeById'
import { getAccountTypePermissionIds } from '../../../utils/account-types/getAccountTypePermissionIds'
import { replaceAccountTypePermissions } from '../../../utils/account-types/replaceAccountTypePermissions'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.accountTypeUpdate)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Account type id is required.' })
  }

  const body = await readBody<UpdateAccountTypeRequest>(event)
  const updates: {
    code?: string
    name?: string
    description?: string | null
    is_system?: boolean
  } = {}

  if (body.code !== undefined) {
    const code = normalizeOptionalText(body.code)?.toLowerCase()

    if (!code) {
      throw createError({ statusCode: 400, statusMessage: 'Account type code cannot be empty.' })
    }

    updates.code = code
  }

  if (body.name !== undefined) {
    const name = normalizeOptionalText(body.name)

    if (!name) {
      throw createError({ statusCode: 400, statusMessage: 'Account type name cannot be empty.' })
    }

    updates.name = name
  }

  if (body.description !== undefined) {
    updates.description = typeof body.description === 'string' ? normalizeOptionalText(body.description) : null
  }

  if (body.isSystem !== undefined) {
    updates.is_system = Boolean(body.isSystem)
  }

  const permissionIds = Array.isArray(body.permissionIds)
    ? [...new Set(body.permissionIds.filter((permissionId): permissionId is string => typeof permissionId === 'string' && permissionId.length > 0))]
    : null

  if (Object.keys(updates).length === 0 && permissionIds === null) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const existingAccountType = await getAccountTypeById(supabase, id)
  const existingPermissionIds = await getAccountTypePermissionIds(supabase, id)

  try {
    await executeWithRollback({
      operation: async () => {
        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabase
            .from('account_types')
            .update(updates)
            .eq('id', id)

          if (updateError) {
            throw createError({ statusCode: 500, statusMessage: `Failed to update account type: ${updateError.message}` })
          }
        }

        if (permissionIds !== null) {
          const { data: permissionMatches, error: permissionLookupError } = await supabase
            .from('permissions')
            .select('id')
            .in('id', permissionIds)

          if (permissionLookupError) {
            throw createError({ statusCode: 500, statusMessage: `Failed to validate permissions: ${permissionLookupError.message}` })
          }

          if ((permissionMatches ?? []).length !== permissionIds.length) {
            throw createError({ statusCode: 400, statusMessage: 'One or more permission ids are invalid.' })
          }

          await replaceAccountTypePermissions(supabase, id, permissionIds)
        }
      },
      rollback: async () => {
        const { error: rollbackTypeError } = await supabase
          .from('account_types')
          .update({
            code: existingAccountType.code,
            name: existingAccountType.name,
            description: existingAccountType.description,
            is_system: existingAccountType.is_system,
          })
          .eq('id', id)

        if (rollbackTypeError) {
          throw rollbackTypeError
        }

        await replaceAccountTypePermissions(supabase, id, existingPermissionIds)
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback account type patch API changes.', rollbackError)
      },
    })

    const updatedAccountType = await getAccountTypeById(supabase, id)
    const updatedPermissionIds = await getAccountTypePermissionIds(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.accountTypeUpdate,
      tableName: 'account_types',
      endpoint: AUDIT_LOG_ENDPOINTS.accountTypesUpdate,
      recordId: id,
      requestData: {
        updates,
        permissionIds,
      },
      oldData: {
        ...existingAccountType,
        permissionIds: existingPermissionIds,
      },
      newData: {
        ...updatedAccountType,
        permissionIds: updatedPermissionIds,
      },
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Account type updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.accountTypeUpdate,
      tableName: 'account_types',
      endpoint: AUDIT_LOG_ENDPOINTS.accountTypesUpdate,
      recordId: id,
      requestData: {
        updates,
        permissionIds,
      },
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
