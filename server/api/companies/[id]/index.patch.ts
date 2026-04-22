import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateCompanyRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  BATTALION_REFERENCE_ID_SELECT_COLUMNS,
  COMPANY_BASE_SELECT_COLUMNS,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { buildCompanyUpdates, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.companyUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Company id is required.')
  const body = await readBody<UpdateCompanyRequest>(event)
  const updates = buildCompanyUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const { data: existingRow, error: existingError } = await supabase
    .from('companies')
    .select(COMPANY_BASE_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (existingError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read company: ${existingError.message}` })
  }

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found.' })
  }

  try {
    if (typeof updates.battalion_id === 'string') {
      const { data: battalion } = await supabase
        .from('battalions')
        .select(BATTALION_REFERENCE_ID_SELECT_COLUMNS)
        .eq('id', updates.battalion_id)
        .maybeSingle()

      if (!battalion) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid battalion id.' })
      }
    }

    await executeWithRollback({
      operation: async () => {
        const { error } = await supabase.from('companies').update(updates).eq('id', id)

        if (error) {
          throw createError({ statusCode: 500, statusMessage: `Failed to update company: ${error.message}` })
        }
      },
      rollback: async () => {
        const { error } = await supabase
          .from('companies')
          .update({
            battalion_id: existingRow.battalion_id,
            code: existingRow.code,
            name: existingRow.name,
            is_active: existingRow.is_active,
          })
          .eq('id', id)

        if (error) {
          throw error
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback company patch API changes.', rollbackError)
      },
    })

    const { data: updatedRow } = await supabase.from('companies').select(COMPANY_BASE_SELECT_COLUMNS).eq('id', id).maybeSingle()

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.companyUpdate,
      tableName: 'companies',
      endpoint: AUDIT_LOG_ENDPOINTS.companiesUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow,
      newData: updatedRow ?? existingRow,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Company updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.companyUpdate,
      tableName: 'companies',
      endpoint: AUDIT_LOG_ENDPOINTS.companiesUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
