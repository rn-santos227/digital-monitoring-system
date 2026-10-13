import { defineEventHandler, getRouterParam, readBody } from 'h3'
import {
  ID_ONLY_SELECT_COLUMNS,
  PERSONNEL_FEEDBACK_CREATE_PERMISSION,
  PERSONNEL_FEEDBACK_CREATE_ACTION,
  PERSONNEL_FEEDBACK_ENDPOINT,
} from '../../../../shared/constants'
import type { CreatePersonnelFeedbackResponse } from '../../../../shared/responses'
import { assertPersonnelExists } from '../../../../shared/utils'
import { parsePersonnelFeedbackPayload, requireRouteId } from '../../../../shared/validation'
import { requirePermission } from '../../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../../utils/auth/serviceClient'
import { recordManagementAuditLog } from '../../../../utils/audit/recordManagementAuditLog'
import { createPersonnelFeedback } from '../../../../utils/personnel-feedback/createPersonnelFeedback'

export default defineEventHandler(async (event): Promise<CreatePersonnelFeedbackResponse> => {
  const actor = await requirePermission(event, PERSONNEL_FEEDBACK_CREATE_PERMISSION)
  let personnelId: string | null = null
  let requestData: object | null = null
  try {
    personnelId = requireRouteId(getRouterParam(event, 'id'), 'Personnel id is required.')
    const body: unknown = await readBody(event)
    requestData = body && typeof body === 'object' && !Array.isArray(body) ? body : null
    const values = parsePersonnelFeedbackPayload(body)
    const supabase = getServiceSupabaseClient()
    await assertPersonnelExists({ supabase, personnelId, idSelectColumns: ID_ONLY_SELECT_COLUMNS })
    const item = await createPersonnelFeedback(supabase, personnelId, actor.id, values)
    await recordManagementAuditLog(event, {
      userId: actor.id, action: PERSONNEL_FEEDBACK_CREATE_ACTION, tableName: 'personnel_performance_feedback',
      endpoint: PERSONNEL_FEEDBACK_ENDPOINT, recordId: item.id, requestData: { ...requestData, personnelId },
      newData: item, statusCode: 201, outcome: 'success',
    })
    return { ok: true, id: item.id, item }
  } catch (error) {
    const statusCode = typeof error === 'object' && error && 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : 500
    await recordManagementAuditLog(event, {
      userId: actor.id, action: PERSONNEL_FEEDBACK_CREATE_ACTION, tableName: 'personnel_performance_feedback',
      endpoint: PERSONNEL_FEEDBACK_ENDPOINT, requestData: { ...requestData, personnelId },
      statusCode, outcome: 'failed', message: error instanceof Error ? error.message : 'Unknown error',
    })
    throw error
  }
})
