import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateTrainingRequest } from '../../shared/requests'
import type { CreateTrainingResponse } from '../../shared/responses'
import type { TrainingCreate } from '../../shared/models'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../shared/constants'
import { resolveTrainingLevelId, resolveTrainingStatusId, mapTrainingListItem } from '../../shared/utils'
import { parseCreateTrainingPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { createTraining } from '../../utils/trainings/createTraining'
import { getTrainingById } from '~~/server/utils/trainings/getTrainingById'
import { deleteTrainingById } from '../../utils/trainings/deleteTrainingById'

export default defineEventHandler(async (event): Promise<CreateTrainingResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingCreate)
  const body = await readBody<CreateTrainingRequest>(event)
  const parsedPayload = parseCreateTrainingPayload(body)

  const payload: TrainingCreate = { ...parsedPayload, created_by: actor.id }
  const supabase = getServiceSupabaseClient()
  const requestData = { ...body }

  try {
    if (payload.level_id) payload.level_id = await resolveTrainingLevelId(supabase, payload.level_id)
    payload.status_id = await resolveTrainingStatusId(supabase, payload.status_id)

    let createdTrainingId: string | null = null
    const result = await executeWithRollback({
      operation: async () => {
        const createdId = await createTraining(supabase, payload)
        createdTrainingId = createdId
        return { createdId }
      },
      rollback: async () => {
        if (createdTrainingId) {
          await deleteTrainingById(supabase, createdTrainingId)
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Training create rollback error:', rollbackError)
      },
    })

    const newRow = await getTrainingById(supabase, result.createdId)
    if (!newRow) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created training record.' })
    }

    const newData: Record<string, unknown> = { ...mapTrainingListItem(newRow) }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCreate,
      tableName: 'trainings',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingsCreate,
      recordId: result.createdId,
      requestData: requestData,
      newData,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training created successfully.',
    })

    return {
      ok: true,
      id: result.createdId,
      item: mapTrainingListItem(newRow)
    }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCreate,
      tableName: 'trainings',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingsCreate,
      requestData: body as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
