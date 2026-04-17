import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateAccountTypeRequest } from '../../shared/requests'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../shared/constants'
import { parseCreateAccountTypePayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.accountTypeCreate)
  const body = await readBody<CreateAccountTypeRequest>(event)
  const payload = parseCreateAccountTypePayload(body)

  const supabase = getServiceSupabaseClient()
  let createdAccountTypeId: string | null = null

  try {
    await executeWithRollback({
      operation: async () => {
        const { data: createdAccountType, error: accountTypeError } = await supabase
          .from('account_types')
          .insert({
            code: payload.code,
            name: payload.name,
            description: payload.description,
            is_system: payload.isSystem,
          })
          .select('id')
          .single<{ id: string }>()

        if (accountTypeError || !createdAccountType?.id) {
          throw createError({ statusCode: 500, statusMessage: `Failed to create account type: ${accountTypeError?.message ?? 'Missing account type id.'}` })
        }

        createdAccountTypeId = createdAccountType.id

        if (payload.permissionIds.length > 0) {
          const { data: permissionMatches, error: permissionLookupError } = await supabase
            .from('permissions')
            .select('id')
            .in('id', payload.permissionIds)

          if (permissionLookupError) {
            throw createError({ statusCode: 500, statusMessage: `Failed to validate permissions: ${permissionLookupError.message}` })
          }

          if ((permissionMatches ?? []).length !== payload.permissionIds.length) {
            throw createError({ statusCode: 400, statusMessage: 'One or more permission ids are invalid.' })
          }

          const { error: permissionInsertError } = await supabase
            .from('account_type_permissions')
            .insert(payload.permissionIds.map((permissionId) => ({
              account_type_id: createdAccountType.id,
              permission_id: permissionId,
            })))

          if (permissionInsertError) {
            throw createError({ statusCode: 500, statusMessage: `Failed to assign account type permissions: ${permissionInsertError.message}` })
          }
        }
      },
      rollback: async () => {
        if (!createdAccountTypeId) {
          return
        }

        const { error } = await supabase
          .from('account_types')
          .delete()
          .eq('id', createdAccountTypeId)

        if (error) {
          throw error
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback account type create API changes.', rollbackError)
      },
    })

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.accountTypeCreate,
      tableName: 'account_types',
      endpoint: AUDIT_LOG_ENDPOINTS.accountTypesCreate,
      recordId: createdAccountTypeId,
      requestData: payload,
      newData: {
        id: createdAccountTypeId,
        ...payload,
      },
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Account type created successfully.',
    })

    return {
      ok: true,
      id: createdAccountTypeId,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.accountTypeCreate,
      tableName: 'account_types',
      endpoint: AUDIT_LOG_ENDPOINTS.accountTypesCreate,
      requestData: payload,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
