import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateEquipmentCategoryRequest } from '../../shared/requests'
import type { CreateEquipmentCategoryApiResponse } from '../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentCategoryListItem } from '../../shared/utils'
import { parseCreateEquipmentCategoryPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { createEquipmentCategory } from '../../utils/equipment-categories/createEquipmentCategory'
import { deleteEquipmentCategoryById } from '../../utils/equipment-categories/deleteEquipmentCategoryById'
import { getEquipmentCategoryById } from '../../utils/equipment-categories/getEquipmentCategoryById'

export default defineEventHandler(async (event): Promise<CreateEquipmentCategoryApiResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.equipmentCreate)
  const body = await readBody<CreateEquipmentCategoryRequest>(event)
  const payload = parseCreateEquipmentCategoryPayload(body)
  const supabase = getServiceSupabaseClient()

  let createdId: string | null = null
  const payloadAuditData: Record<string, unknown> = { ...payload }

  try {
    createdId = await executeWithRollback({
      operation: async () => {
        const insertedId = await createEquipmentCategory(supabase, payload)
        createdId = insertedId

        await recordManagementAuditLog(event, {
          userId: actor.id,
          action: AUDIT_LOG_ACTIONS.equipmentCategoryCreate,
          tableName: 'equipment_categories',
          endpoint: AUDIT_LOG_ENDPOINTS.equipmentCategoriesCreate,
          recordId: insertedId,
          requestData: body as Record<string, unknown>,
          newData: payloadAuditData,
          statusCode: 201,
          outcome: AUDIT_LOG_OUTCOMES.success,
          message: 'Equipment category created successfully.',
        })

        return insertedId
      },
      rollback: async () => {
        if (!createdId) {
          return
        }

        await deleteEquipmentCategoryById(supabase, createdId)
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback equipment category create API changes.', rollbackError)
      },
    })

    const createdCategory = await getEquipmentCategoryById(supabase, createdId)

    if (!createdCategory) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created equipment category record.' })
    }

    return {
      ok: true,
      id: createdId,
      item: mapEquipmentCategoryListItem(createdCategory),
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentCategoryCreate,
      tableName: 'equipment_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentCategoriesCreate,
      recordId: createdId,
      requestData: body as Record<string, unknown>,
      newData: payloadAuditData,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
