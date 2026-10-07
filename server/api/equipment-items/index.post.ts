import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateEquipmentItemRequest } from '../../shared/requests'
import type { CreateEquipmentItemApiResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../shared/constants'
import { mapEquipmentItemListItem } from '../../shared/utils'
import { parseCreateEquipmentItemPayload } from '../../shared/validation'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { createEquipmentItem } from '../../utils/equipment-items/createEquipmentItem'
import { deleteEquipmentItemById } from '../../utils/equipment-items/deleteEquipmentItemById'
import { getEquipmentItemById } from '../../utils/equipment-items/getEquipmentItemById'

export default defineEventHandler(async (event): Promise<CreateEquipmentItemApiResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.equipmentCreate)
  const body = await readBody<CreateEquipmentItemRequest>(event)
  const payload = parseCreateEquipmentItemPayload(body)
  const supabase = getServiceSupabaseClient()
  let createdId: string | null = null

  try {
    createdId = await executeWithRollback({
      operation: async () => createEquipmentItem(supabase, payload),
      rollback: async () => {
        if (createdId) {
          await deleteEquipmentItemById(supabase, createdId)
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback equipment item create API changes.', rollbackError)
      },
    })

    const createdEquipmentItem = await getEquipmentItemById(supabase, createdId)

    if (!createdEquipmentItem) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created equipment item record.' })
    }

    await recordManagementAuditLog(event, { 
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentItemCreate,
      tableName: 'equipment_items',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentItemsCreate,
      recordId: createdId,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: 201, 
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment item created successfully.'
    })
    return { ok: true, id: createdId, item: mapEquipmentItemListItem(createdEquipmentItem) }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await recordManagementAuditLog(event, { 
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentItemCreate,
      tableName: 'equipment_items',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentItemsCreate,
      recordId: createdId,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message
    })
    throw error
  }
})
