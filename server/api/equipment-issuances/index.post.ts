import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateEquipmentIssuanceRequest } from '../../shared/requests'
import type { CreateEquipmentIssuanceApiResponse } from '../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../shared/constants'
import { mapEquipmentIssuanceListItem } from '../../shared/utils'
import { parseCreateEquipmentIssuancePayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { createEquipmentIssuance } from '../../utils/equipment-issuances/createEquipmentIssuance'
import { deleteEquipmentIssuanceById } from '../../utils/equipment-issuances/deleteEquipmentIssuanceById'
import { getEquipmentIssuanceById } from '../../utils/equipment-issuances/getEquipmentIssuanceById'

export default defineEventHandler(async (event): Promise<CreateEquipmentIssuanceApiResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.equipmentIssue)
  const body = await readBody<CreateEquipmentIssuanceRequest>(event)
  const payload = parseCreateEquipmentIssuancePayload(body)
  const supabase = getServiceSupabaseClient()
  let createdId: string | null = null

  try {
    createdId = await executeWithRollback({
      operation: async () => createEquipmentIssuance(supabase, payload),
      rollback: async () => {
        if (createdId) {
          await deleteEquipmentIssuanceById(supabase, createdId)
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Equipment issuance create rollback error:', rollbackError)
      },
    })

    if (!createdId) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to create equipment issuance.' })
    }

    const newRow = await getEquipmentIssuanceById(supabase, createdId)
    if (!newRow) throw createError({ statusCode: 500, statusMessage: 'Failed to load created equipment issuance.' })

    await recordManagementAuditLog(event, { 
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentIssuanceCreate,
      tableName: 'equipment_issuances',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentIssuancesCreate,
      recordId: createdId,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Equipment issuance created successfully.'
    })
    return { ok: true, id: createdId, item: mapEquipmentIssuanceListItem(newRow) }
  } catch (error: unknown) {
    await recordManagementAuditLog(event, { 
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.equipmentIssuanceCreate,
      tableName: 'equipment_issuances',
      endpoint: AUDIT_LOG_ENDPOINTS.equipmentIssuancesCreate,
      recordId: createdId ?? undefined,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: (error as { statusCode?: number })?.statusCode ?? 500,
      outcome: AUDIT_LOG_OUTCOMES.failed, message: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
})
