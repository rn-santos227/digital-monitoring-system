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
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteEquipmentIssuanceById } from '../../../utils/equipment-issuances/deleteEquipmentIssuanceById'
import { getEquipmentIssuanceById } from '../../../utils/equipment-issuances/getEquipmentIssuanceById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requireAnyPermission(event, [PERMISSION_CODES.equipmentIssue, PERMISSION_CODES.equipmentManage])
  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment issuance id is required.')
  const supabase = getServiceSupabaseClient()
  const existing = await getEquipmentIssuanceById(supabase, id)

  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment issuance not found.' })
  }

  try {
    await deleteEquipmentIssuanceById(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentIssuanceDelete,
      tableName: 'equipment_issuances',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentIssuancesDelete,
      recordId: id,
      oldData: existing as Record<string, unknown>,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment issuance deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentIssuanceDelete,
      tableName: 'equipment_issuances',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentIssuancesDelete,
      recordId: id,
      oldData: existing as Record<string, unknown>,
      statusCode: (error as { statusCode?: number })?.statusCode ?? 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message: error instanceof Error ? error.message : 'Unknown error',
    })

    throw error
  }
})
