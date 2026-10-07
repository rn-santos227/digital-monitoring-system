import {
  createError,
  defineEventHandler,
  getRouterParam,
  readBody,
} from 'h3'
import type { UpdateEquipmentItemRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { buildEquipmentItemUpdates, requireRouteId } from '../../../shared/validation'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getEquipmentItemById } from '../../../utils/equipment-items/getEquipmentItemById'
import { updateEquipmentItemById } from '../../../utils/equipment-items/updateEquipmentItemById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.equipmentUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment item id is required.')
  const body = await readBody<UpdateEquipmentItemRequest>(event)
  const updates = buildEquipmentItemUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const existingRow = await getEquipmentItemById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment item not found.' })
  }

  try {
    await executeWithRollback({
      operation: async () => {
        await updateEquipmentItemById(supabase, id, updates)
      },
      rollback: async () => {
        await updateEquipmentItemById(supabase, id, {
          equipment_code: existingRow.equipment_code,
          category_id: existingRow.category_id,
          name: existingRow.name,
          model: existingRow.model,
          manufacturer: existingRow.manufacturer,
          description: existingRow.description,
          unit_of_measure: existingRow.unit_of_measure,
          minimum_stock_level: existingRow.minimum_stock_level,
          is_serialized: existingRow.is_serialized,
          is_active: existingRow.is_active,
        })
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback equipment item patch API changes.', rollbackError)
      },
    })
    await recordManagementAuditLog(event, { 
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentItemUpdate,
      tableName: 'equipment_items',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentItemsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow as Record<string, unknown>,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment item updated successfully.',
    })
    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentItemUpdate,
      tableName: 'equipment_items',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentItemsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRow as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })
    throw error
  }
})
