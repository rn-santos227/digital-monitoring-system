import { createError, defineEventHandler, getRouterParam } from 'h3'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteEquipmentAssetById } from '../../../utils/equipment-assets/deleteEquipmentAssetById'
import { getEquipmentAssetById } from '../../../utils/equipment-assets/getEquipmentAssetById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.equipmentDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment asset id is required.')
  const supabase = getServiceSupabaseClient()
  const existingRow = await getEquipmentAssetById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment asset not found.' })
  }

  const existingRowRecord = existingRow as unknown as Record<string, unknown>

  try {
    await deleteEquipmentAssetById(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentAssetDelete,
      tableName: 'equipment_assets',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentAssetsDelete,
      recordId: id,
      oldData: existingRowRecord,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment asset deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentAssetDelete,
      tableName: 'equipment_assets',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentAssetsDelete,
      recordId: id,
      oldData: existingRowRecord,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
