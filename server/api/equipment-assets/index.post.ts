import { createError, defineEventHandler, readBody } from 'h3'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../shared/constants'
import type { CreateEquipmentAssetRequest } from '../../shared/requests'
import type { CreateEquipmentAssetApiResponse } from '../../shared/responses'
import { parseCreateEquipmentAssetPayload } from '../../shared/validations'
import { mapEquipmentAssetListItem } from '../../shared/utils/equipment-management'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { createEquipmentAsset } from '../../utils/equipment-assets/createEquipmentAsset'
import { deleteEquipmentAssetById } from '../../utils/equipment-assets/deleteEquipmentAssetById'
import { getEquipmentAssetById } from '../../utils/equipment-assets/getEquipmentAssetById'

export default defineEventHandler(async (event): Promise<CreateEquipmentAssetApiResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.equipmentCreate)
  const body = await readBody<CreateEquipmentAssetRequest>(event)
  const payload = parseCreateEquipmentAssetPayload(body)
  const supabase = getServiceSupabaseClient()
  let createdId: string | null = null

  try {
    createdId = await executeWithRollback({
      operation: async () => createEquipmentAsset(supabase, payload),
      rollback: async () => {
        if (createdId) {
          await deleteEquipmentAssetById(supabase, createdId)
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback equipment asset create API changes.', rollbackError)
      },
    })

    const row = await getEquipmentAssetById(supabase, createdId)

    if (!row) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created equipment asset.' })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentAssetCreate,
      tableName: 'equipment_assets',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentAssetsCreate,
      recordId: createdId,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment asset created successfully.',
    })

    return {
      ok: true,
      id: createdId,
      item: mapEquipmentAssetListItem(row),
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentAssetCreate,
      tableName: 'equipment_assets',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentAssetsCreate,
      recordId: createdId,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
