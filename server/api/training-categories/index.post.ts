import { defineEventHandler, readBody } from 'h3'
import type { CreateTrainingCategoryRequest } from '../../shared/requests'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../shared/constants'
import { parseCreateTrainingCategoryPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { executeWithRollback } from '../../utils/db/executeWithRollback'
import { createTrainingCategory } from '../../utils/training-categories/createTrainingCategory'
import { deleteTrainingCategoryById } from '../../utils/training-categories/deleteTrainingCategoryById'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingCreate)
  const body = await readBody<CreateTrainingCategoryRequest>(event)
  const payload = parseCreateTrainingCategoryPayload(body)
  const supabase = getServiceSupabaseClient()

  let createdId: string | null = null
  const payloadAuditData: Record<string, unknown> = { ...payload }

  try {
    createdId = await executeWithRollback({
      operation: async () => {
        const insertedId = await createTrainingCategory(supabase, payload)
        createdId = insertedId

        await recordManagementAuditLog(event, {
          userId: actor.id,
          action: AUDIT_LOG_ACTIONS.trainingCategoryCreate,
          tableName: 'training_categories',
          endpoint: AUDIT_LOG_ENDPOINTS.trainingCategoriesCreate,
          recordId: insertedId,
          requestData: body as Record<string, unknown>,
          newData: payloadAuditData,
          statusCode: 201,
          outcome: AUDIT_LOG_OUTCOMES.success,
          message: 'Training category created successfully.',
        })

        return insertedId
      },
      rollback: async () => {
        if (!createdId) {
          return
        }

        await deleteTrainingCategoryById(supabase, createdId)
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback training category create API changes.', rollbackError)
      },
    })

    return { ok: true, id: createdId }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingCategoryCreate,
      tableName: 'training_categories',
      endpoint: AUDIT_LOG_ENDPOINTS.trainingCategoriesCreate,
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
