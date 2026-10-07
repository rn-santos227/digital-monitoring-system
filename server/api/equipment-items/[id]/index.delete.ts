import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validation'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteEquipmentItemById } from '../../../utils/equipment-items/deleteEquipmentItemById'
import { getEquipmentItemById } from '../../../utils/equipment-items/getEquipmentItemById'
import { getEquipmentItemUsageCounts } from '../../../utils/equipment-items/getEquipmentItemUsageCounts'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.equipmentDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment item id is required.')
  const supabase = getServiceSupabaseClient()
  const existingRow = await getEquipmentItemById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment item not found.' })
  }

  try {
    const usageCount = await getEquipmentItemUsageCounts(supabase, id)
    if (usageCount > 0) {
      throw createError({ statusCode: 409, statusMessage: 'Equipment item is in use and cannot be deleted.' })
    }
    await deleteEquipmentItemById(supabase, id)
    await recordManagementAuditLog(event, { 
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentItemDelete,
      tableName: 'equipment_items',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentItemsDelete,
      recordId: id,
      oldData: existingRow as Record<string, unknown>,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment item deleted successfully.'
    })
    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await recordManagementAuditLog(event, { 
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentItemDelete,
      tableName: 'equipment_items',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentItemsDelete,
      recordId: id,
      oldData: existingRow as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message
    })
    throw error
  }
})
