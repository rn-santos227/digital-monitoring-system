import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import type { UpdateEquipmentAssetRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { buildEquipmentAssetUpdates, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getEquipmentAssetById } from '../../../utils/equipment-assets/getEquipmentAssetById'
import { updateEquipmentAssetById } from '../../../utils/equipment-assets/updateEquipmentAssetById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.equipmentUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment asset id is required.')
  const body = await readBody<UpdateEquipmentAssetRequest>(event)
  const updates = buildEquipmentAssetUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const existingRow = await getEquipmentAssetById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment asset not found.' })
  }

  const existingRowRecord = existingRow as unknown as Record<string, unknown>

  try {
    await executeWithRollback({
      operation: async () => {
        await updateEquipmentAssetById(supabase, id, updates)
      },
      rollback: async () => {
        await updateEquipmentAssetById(supabase, id, {
          asset_tag: existingRow.asset_tag,
          equipment_item_id: existingRow.equipment_item_id,
          serial_no: existingRow.serial_no,
          batch_no: existingRow.batch_no,
          procurement_date: existingRow.procurement_date,
          acquisition_cost: existingRow.acquisition_cost,
          fund_source: existingRow.fund_source,
          current_location: existingRow.current_location,
          condition_status_id: existingRow.condition_status_id,
          serviceability_status_id: existingRow.serviceability_status_id,
          asset_status_id: existingRow.asset_status_id,
          remarks: existingRow.remarks,
        })
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback equipment asset patch API changes.', rollbackError)
      },
    })

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentAssetUpdate,
      tableName: 'equipment_assets',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentAssetsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRowRecord,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment asset updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentAssetUpdate,
      tableName: 'equipment_assets',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentAssetsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingRowRecord,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
