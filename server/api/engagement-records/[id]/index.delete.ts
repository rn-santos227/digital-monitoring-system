import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { mapEngagementRecordListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
const REQUIRED_PERMISSION_CODE = PERMISSION_CODES.engagementManage

import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { deleteEngagementRecordById } from '../../../utils/engagement-records/deleteEngagementRecordById'
import { getEngagementRecordById } from '../../../utils/engagement-records/getEngagementRecordById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, REQUIRED_PERMISSION_CODE)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Engagement record id is required.')
  const supabase = getServiceSupabaseClient()
  const existingRow = await getEngagementRecordById(supabase, id)

  if (!existingRow) throw createError({ statusCode: 404, statusMessage: 'Engagement record not found.' })
  const oldData = { ...mapEngagementRecordListItem(existingRow) }
  
  try {
    await deleteEngagementRecordById(supabase, id)
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.engagementRecordDelete,
      tableName: 'engagement_records',
      endpoint: AUDIT_LOG_ENDPOINTS.engagementRecordsDelete,
      recordId: id,
      oldData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Engagement record deleted successfully.'
    })
    
    return { ok: true }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.engagementRecordDelete,
      tableName: 'engagement_records',
      endpoint: AUDIT_LOG_ENDPOINTS.engagementRecordsDelete,
      recordId: id,
      oldData,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message
    })
    throw error

  }
})
