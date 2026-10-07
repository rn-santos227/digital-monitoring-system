import {
  createError,
  defineEventHandler,
  getRouterParam,
  readBody,
} from 'h3'
import type { UpdateEquipmentCategoryRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { buildEquipmentCategoryUpdates, requireRouteId } from '../../../shared/validation'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getEquipmentCategoryById } from '../../../utils/equipment-categories/getEquipmentCategoryById'
import { updateEquipmentCategoryById } from '../../../utils/equipment-categories/updateEquipmentCategoryById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.equipmentUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment category id is required.')
  const body = await readBody<UpdateEquipmentCategoryRequest>(event)
  const updates = buildEquipmentCategoryUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const existingRow = await getEquipmentCategoryById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment category not found.' })
  }

  const existingRowAuditData: Record<string, unknown> = { ...existingRow }

  try {
    await executeWithRollback({
      operation: async () => {
        await updateEquipmentCategoryById(supabase, id, updates)
      },
      rollback: async () => {
        await updateEquipmentCategoryById(supabase, id, {
          code: existingRow.code,
          name: existingRow.name,
          requires_serial: existingRow.requires_serial,
          is_consumable: existingRow.is_consumable,
          is_controlled: existingRow.is_controlled,
          is_active: existingRow.is_active,
        })
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback equipment category patch API changes.', rollbackError)
      },
    })

    const updatedRow = await getEquipmentCategoryById(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentCategoryUpdate,
      tableName: 'equipment_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentCategoriesUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRowAuditData,
      newData: updatedRow ?? existingRow,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment category updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentCategoryUpdate,
      tableName: 'equipment_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentCategoriesUpdate,
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
