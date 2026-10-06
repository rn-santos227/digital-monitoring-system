import {
  createError,
  defineEventHandler,
  getRouterParam,
  readBody,
} from 'h3'
import type { UpdateCompanyRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { buildCompanyUpdates, requireRouteId } from '../../../shared/validation'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getCompanyById } from '../../../utils/companies/getCompanyById'
import { updateCompanyById } from '../../../utils/companies/updateCompanyById'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { assertBattalionExists } from '../../../utils/companies/assertBattalionExists'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.companyUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Company id is required.')
  const body = await readBody<UpdateCompanyRequest>(event)
  const updates = buildCompanyUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const existingRow = await getCompanyById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found.' })
  }

  const existingRowAuditData: Record<string, unknown> = { ...existingRow }

  try {
    if (typeof updates.battalion_id === 'string') {
      await assertBattalionExists(supabase, updates.battalion_id)
    }

    await executeWithRollback({
      operation: async () => updateCompanyById(supabase, id, updates),
      rollback: async () => {
        await updateCompanyById(supabase, id, {
          battalion_id: existingRow.battalion_id,
          code: existingRow.code,
          name: existingRow.name,
          is_active: existingRow.is_active,
        })
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback company patch API changes.', rollbackError)
      },
    })

    const updatedRow = await getCompanyById(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.companyUpdate,
      tableName: 'companies',
      endpoint: AUDIT_LOG_ENDPOINTS.companiesUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRowAuditData,
      newData: { ...(updatedRow ?? existingRow) },
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
      oldData: existingRowAuditData,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
