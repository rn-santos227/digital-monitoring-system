import {
  createError,
  defineEventHandler,
  getRouterParam,
  readBody,
} from 'h3'
import type { CreateEngagementRecordRequest } from '../../../shared/requests'
import type { CreateEngagementRecordResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  ID_ONLY_SELECT_COLUMNS,
  PERMISSION_CODES,
} from '../../../shared/constants'
import {
  PERSONNEL_ROUTE_ID_REQUIRED_MESSAGE,
  PERSONNEL_ROUTE_PARAM_KEY,
  withPersonnelId,
  assertPersonnelExists,
  buildEngagementRecordNo,
  mapEngagementRecordListItem,
} from '../../../shared/utils'
import { parseCreateEngagementRecordPayload, requireRouteId } from '../../../shared/validation'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { createEngagementRecord } from '../../../utils/engagement-records/createEngagementRecord'
import { deleteEngagementRecordById } from '../../../utils/engagement-records/deleteEngagementRecordById'
import { getEngagementRecordById } from '../../../utils/engagement-records/getEngagementRecordById'
import { getEngagementSourceById } from '../../../utils/engagement-records/getEngagementSourceById'

export default defineEventHandler(async (event): Promise<CreateEngagementRecordResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.engagementManage)
  const personnelId = requireRouteId(getRouterParam(event, PERSONNEL_ROUTE_PARAM_KEY), PERSONNEL_ROUTE_ID_REQUIRED_MESSAGE)
  const body = await readBody<CreateEngagementRecordRequest>(event)
  const supabase = getServiceSupabaseClient()
  const requestData = withPersonnelId(body, personnelId)

  try {
    const payload = parseCreateEngagementRecordPayload(withPersonnelId(body, personnelId))
    const engagement = await getEngagementSourceById(supabase, payload.engagement_id)
    if (!engagement) throw createError({ statusCode: 404, statusMessage: 'Engagement not found.' })

    await assertPersonnelExists({ supabase, personnelId: payload.personnel_id, idSelectColumns: ID_ONLY_SELECT_COLUMNS })

    if (payload.valid_until && engagement.end_date && new Date(payload.valid_until).getTime() < new Date(engagement.end_date).getTime()) {
      throw createError({ statusCode: 400, statusMessage: 'Valid until must be on or after engagement end date.' })
    }

    const insertPayload = {
      record_no: buildEngagementRecordNo(),
      personnel_id: payload.personnel_id,
      engagement_id: engagement.id,
      engagement_title: engagement.engagement_title,
      engagement_type_id: engagement.engagement_type_id,
      level_id: engagement.level_id,
      start_date: engagement.start_date,
      end_date: engagement.end_date,
      status_id: engagement.status_id,
      certificate_no: payload.certificate_no,
      valid_until: payload.valid_until,
      remarks: payload.remarks ?? engagement.default_remarks ?? null,
    }

    let createdId: string | null = null
    const result = await executeWithRollback({
      operation: async () => {
        createdId = await createEngagementRecord(supabase, insertPayload)
        return { createdId }
      },
      rollback: async () => {
        if (!createdId) {
          return
        }
        await deleteEngagementRecordById(supabase, createdId)
      },
      onRollbackError: (rollbackError) => {
        console.error('Engagement record assign rollback error:', rollbackError)
      },
    })

    const newRow = await getEngagementRecordById(supabase, result.createdId)
    if (!newRow) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created engagement record.' })
    }

    const item = mapEngagementRecordListItem(newRow)
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.engagementRecordCreate,
      tableName: 'engagement_records',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelAssignEngagementRecord,
      recordId: result.createdId,
      requestData,
      newData: { ...item },
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Engagement record assigned successfully.',
    })

    return { ok: true, id: result.createdId, item }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.engagementRecordCreate,
      tableName: 'engagement_records',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelAssignEngagementRecord,
      requestData,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
