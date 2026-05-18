import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { CreateTrainingRecordRequest } from '../../../shared/requests'
import type { CreateTrainingRecordResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, ID_ONLY_SELECT_COLUMNS, PERMISSION_CODES } from '../../../shared/constants'
import { PERSONNEL_ROUTE_ID_REQUIRED_MESSAGE, PERSONNEL_ROUTE_PARAM_KEY, withPersonnelId, assertPersonnelExists, buildTrainingRecordNo, mapTrainingRecordListItem } from '../../../shared/utils'
import { parseCreateTrainingRecordPayload, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { createTrainingRecord } from '../../../utils/training-records/createTrainingRecord'
import { deleteTrainingRecordById } from '../../../utils/training-records/deleteTrainingRecordById'
import { getTrainingRecordById } from '../../../utils/training-records/getTrainingRecordById'
import { getTrainingSourceById } from '../../../utils/training-records/getTrainingSourceById'

export default defineEventHandler(async (event): Promise<CreateTrainingRecordResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.trainingManage)
  const personnelId = requireRouteId(getRouterParam(event, PERSONNEL_ROUTE_PARAM_KEY), PERSONNEL_ROUTE_ID_REQUIRED_MESSAGE)
  const body = await readBody<CreateTrainingRecordRequest>(event)
  const supabase = getServiceSupabaseClient()
  const requestData = withPersonnelId(body, personnelId)

  try {
    const payload = parseCreateTrainingRecordPayload(withPersonnelId(body, personnelId))
    const training = await getTrainingSourceById(supabase, payload.training_id)
    if (!training) throw createError({ statusCode: 404, statusMessage: 'Training not found.' })

    await assertPersonnelExists({ supabase, personnelId: payload.personnel_id, idSelectColumns: ID_ONLY_SELECT_COLUMNS })

    if (payload.valid_until && training.end_date && new Date(payload.valid_until).getTime() < new Date(training.end_date).getTime()) {
      throw createError({ statusCode: 400, statusMessage: 'Valid until must be on or after training end date.' })
    }

    const insertPayload = {
      record_no: buildTrainingRecordNo(),
      personnel_id: payload.personnel_id,
      training_id: training.id,
      training_title: training.training_title,
      training_category_id: training.training_category_id,
      level_id: training.level_id,
      start_date: training.start_date,
      end_date: training.end_date,
      status_id: training.status_id,
      certificate_no: payload.certificate_no,
      valid_until: payload.valid_until,
      remarks: payload.remarks ?? training.default_remarks ?? null,
    }

    let createdId: string | null = null
    const result = await executeWithRollback({
      operation: async () => {
        createdId = await createTrainingRecord(supabase, insertPayload)

        return { createdId }
      },
      rollback: async () => {
        if (!createdId) {
          return
        }

        await deleteTrainingRecordById(supabase, createdId)
      },
      onRollbackError: (rollbackError) => {
        console.error('Training record assign rollback error:', rollbackError)
      },
    })

    const newRow = await getTrainingRecordById(supabase, result.createdId)
    if (!newRow) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created training record.' })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordCreate,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelAssignTrainingRecord,
      recordId: result.createdId,
      requestData,
      newData: { ...mapTrainingRecordListItem(newRow) },
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Training record assigned successfully.',
    })

    return { ok: true, id: result.createdId, item: mapTrainingRecordListItem(newRow) }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.trainingRecordCreate,
      tableName: 'training_records',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelAssignTrainingRecord,
      requestData,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
