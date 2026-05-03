import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateBattalionRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { buildBattalionUpdates, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getBattalionById } from '../../../utils/battalions/getBattalionById'
import { updateBattalionById } from '../../../utils/battalions/updateBattalionById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.battalionUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Battalion id is required.')
  const body = await readBody<UpdateBattalionRequest>(event)
  const updates = buildBattalionUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const existingRow = await getBattalionById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Battalion not found.' })
  }

  const existingRowAuditData: Record<string, unknown> = { ...existingRow }
  try {
    await executeWithRollback({
      operation: async () => {
        await updateBattalionById(supabase, id, updates)
      },
      rollback: async () => {
        await updateBattalionById(supabase, id, {
          code: existingRow.code,
          name: existingRow.name,
          is_active: existingRow.is_active,
        })
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback battalion patch API changes.', rollbackError)
      },
    })

    const updatedRow = await getBattalionById(supabase, id)
    const updatedRowAuditData: Record<string, unknown> = { ...(updatedRow ?? existingRow) }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.battalionUpdate,
      tableName: 'battalions',
      endpoint: AUDIT_LOG_ENDPOINTS.battalionsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRowAuditData,
      newData: updatedRowAuditData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Battalion updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.battalionUpdate,
      tableName: 'battalions',
      endpoint: AUDIT_LOG_ENDPOINTS.battalionsUpdate,
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
