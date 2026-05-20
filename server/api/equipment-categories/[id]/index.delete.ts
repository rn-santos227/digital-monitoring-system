import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteEquipmentCategoryById } from '../../../utils/equipment-categories/deleteEquipmentCategoryById'
import { getEquipmentCategoryById } from '../../../utils/equipment-categories/getEquipmentCategoryById'
import { getEquipmentCategoryUsageCounts } from '../../../utils/equipment-categories/getEquipmentCategoryUsageCounts'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.equipmentDelete)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Equipment category id is required.')
  const supabase = getServiceSupabaseClient()

  const existingRow = await getEquipmentCategoryById(supabase, id)

  if (!existingRow) {
    throw createError({ statusCode: 404, statusMessage: 'Equipment category not found.' })
  }

  const existingRowAuditData: Record<string, unknown> = { ...existingRow }

  try {
    const usageCount = await getEquipmentCategoryUsageCounts(supabase, id)

    if (usageCount > 0) {
      throw createError({ statusCode: 409, statusMessage: 'Equipment category is in use and cannot be deleted.' })
    }

    await deleteEquipmentCategoryById(supabase, id)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentCategoryDelete,
      tableName: 'equipment_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentCategoriesDelete,
      recordId: id,
      oldData: existingRowAuditData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment category deleted successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentCategoryDelete,
      tableName: 'equipment_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentCategoriesDelete,
      recordId: id,
      oldData: existingRowAuditData,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
