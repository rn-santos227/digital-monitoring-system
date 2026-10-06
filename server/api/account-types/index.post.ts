import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateAccountTypeRequest } from '../../shared/requests'
import type { CreateAccountTypeResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../shared/constants'
import { mapAccountTypeListItem } from '../../shared/utils'
import { parseCreateAccountTypePayload } from '../../shared/validation'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { createAccountTypeWithPermissions } from '../../utils/account-types/createAccountTypeWithPermissions'

export default defineEventHandler(async (event): Promise<CreateAccountTypeResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.accountTypeCreate)
  const body = await readBody<CreateAccountTypeRequest>(event)
  const payload = parseCreateAccountTypePayload(body)

  const supabase = getServiceSupabaseClient()
  let createdAccountType: Parameters<typeof mapAccountTypeListItem>[0] | null = null
  let createdAccountTypeId: string | null = null

  try {
    await executeWithRollback({
      operation: async () => {
        const { accountType } = await createAccountTypeWithPermissions(supabase, payload)
        createdAccountType = accountType
        createdAccountTypeId = accountType.id
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
      requestData: payload as Record<string, unknown>,
      newData: {
        id: createdAccountTypeId,
        ...payload,
      },
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Account type created successfully.',
    })

    if (!createdAccountTypeId) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to resolve created account type id.' })
    }

    if (!createdAccountType) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to resolve created account type payload.' })
    }

    return {
      ok: true,
      id: createdAccountTypeId,
      item: mapAccountTypeListItem(createdAccountType),
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.accountTypeCreate,
      tableName: 'account_types',
      endpoint: AUDIT_LOG_ENDPOINTS.accountTypesCreate,
      requestData: payload as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
