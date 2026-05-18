import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { CreateEngagementRecordRequest } from '../../../shared/requests'
import type { CreateEngagementRecordResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, ID_ONLY_SELECT_COLUMNS, PERMISSION_CODES } from '../../../shared/constants'
import { PERSONNEL_ROUTE_ID_REQUIRED_MESSAGE, PERSONNEL_ROUTE_PARAM_KEY, withPersonnelId, assertPersonnelExists, buildEngagementRecordNo, mapEngagementRecordListItem } from '../../../shared/utils'
import { parseCreateEngagementRecordPayload, requireRouteId } from '../../../shared/validations'
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

})
