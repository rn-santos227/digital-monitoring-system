import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateEquipmentIssuanceRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { buildEquipmentIssuanceUpdates, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getEquipmentIssuanceById } from '../../../utils/equipment-issuances/getEquipmentIssuanceById'
import { updateEquipmentIssuanceById } from '../../../utils/equipment-issuances/updateEquipmentIssuanceById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.equipmentIssue)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment issuance id is required.')
  const body = await readBody<UpdateEquipmentIssuanceRequest>(event)
  const updates = buildEquipmentIssuanceUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const existing = await getEquipmentIssuanceById(supabase, id)
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment issuance not found.' })
  }

  const rollbackUpdates = {
    equipment_asset_id: existing.equipment_asset_id,
    issued_to_personnel_id: existing.issued_to_personnel_id,
    issued_by_personnel_id: existing.issued_by_personnel_id,
    deployment_id: existing.deployment_id,
    issue_date: existing.issue_date,
    expected_return_date: existing.expected_return_date,
    actual_return_date: existing.actual_return_date,
    quantity_issued: existing.quantity_issued,
    status_id: existing.status_id,
    issued_location: existing.issued_location,
    return_location: existing.return_location,
    remarks: existing.remarks,
  }

  try {
    await executeWithRollback({
      operation: async () => {
        await updateEquipmentIssuanceById(supabase, id, updates)
      },
      rollback: async () => {
        await updateEquipmentIssuanceById(supabase, id, rollbackUpdates)
      },
      onRollbackError: (error) => {
        console.error('Equipment issuance update rollback error:', error)
      },
    })

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentIssuanceUpdate,
      tableName: 'equipment_issuances',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentIssuancesUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existing as Record<string, unknown>,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment issuance updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentIssuanceUpdate,
      tableName: 'equipment_issuances',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentIssuancesUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existing as Record<string, unknown>,
      statusCode: (error as { statusCode?: number })?.statusCode ?? 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message: error instanceof Error ? error.message : 'Unknown error',
    })

    throw error
  }
})
