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
