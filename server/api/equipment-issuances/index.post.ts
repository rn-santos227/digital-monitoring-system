import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateEquipmentIssuanceRequest } from '../../shared/requests'
import type { CreateEquipmentIssuanceApiResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../shared/constants'
import {
  mapEquipmentIssuanceListItem,
  resolveEquipmentAssetStatusId,
  resolveEquipmentIssuanceStatusId,
} from '../../shared/utils'
import { parseCreateEquipmentIssuancePayload } from '../../shared/validation'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { getEquipmentAssetById } from '../../utils/equipment-assets/getEquipmentAssetById'
import { updateEquipmentAssetById } from '../../utils/equipment-assets/updateEquipmentAssetById'
import { createEquipmentIssuance } from '../../utils/equipment-issuances/createEquipmentIssuance'
import { deleteEquipmentIssuanceById } from '../../utils/equipment-issuances/deleteEquipmentIssuanceById'
import { getEquipmentIssuanceById } from '../../utils/equipment-issuances/getEquipmentIssuanceById'

export default defineEventHandler(async (event): Promise<CreateEquipmentIssuanceApiResponse> => {
  const actor = await requireAnyPermission(event, [PERMISSION_CODES.equipmentIssue, PERMISSION_CODES.equipmentManage])
  const body = await readBody<CreateEquipmentIssuanceRequest>(event)
  const supabase = getServiceSupabaseClient()
  let createdId: string | null = null
  let payload: ReturnType<typeof parseCreateEquipmentIssuancePayload>['payload'] | null = null

  try {
    const parsed = parseCreateEquipmentIssuancePayload(body)
    const issuancePayload = parsed.payload
    issuancePayload.status_id = await resolveEquipmentIssuanceStatusId(supabase, issuancePayload.status_id)
    payload = issuancePayload

    const resolvedEquipmentAssetStatusId = parsed.equipmentAssetStatusId
      ? await resolveEquipmentAssetStatusId(supabase, parsed.equipmentAssetStatusId)
      : null
    const existingEquipmentAsset = await getEquipmentAssetById(supabase, issuancePayload.equipment_asset_id)

    if (!existingEquipmentAsset) {
      throw createError({ statusCode: 404, statusMessage: 'Equipment asset not found.' })
    }

    createdId = await executeWithRollback({
      operation: async () => {
        const id = await createEquipmentIssuance(supabase, issuancePayload)
        createdId = id

        if (resolvedEquipmentAssetStatusId) {
          await updateEquipmentAssetById(supabase, issuancePayload.equipment_asset_id, {
            asset_status_id: resolvedEquipmentAssetStatusId,
          })
        }

        return id
      },
      rollback: async () => {
        if (createdId) {
          await deleteEquipmentIssuanceById(supabase, createdId)
        }

        if (resolvedEquipmentAssetStatusId) {
          await updateEquipmentAssetById(supabase, issuancePayload.equipment_asset_id, {
            asset_status_id: existingEquipmentAsset.asset_status_id,
          })
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
      newData: payload ?? (body as Record<string, unknown>),
      statusCode: (error as { statusCode?: number })?.statusCode ?? 500,
      outcome: AUDIT_LOG_OUTCOMES.failed, message: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
})
