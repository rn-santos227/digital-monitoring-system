import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { CreateDeploymentRecordFromDeploymentRequest } from '../../../shared/requests'
import type { CreateDeploymentRecordResponse } from '../../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, DEPLOYMENT_PERMISSION_GROUPS, ID_ONLY_SELECT_COLUMNS } from '../../../shared/constants'
import { PERSONNEL_ROUTE_ID_REQUIRED_MESSAGE, PERSONNEL_ROUTE_PARAM_KEY, withPersonnelId, assertPersonnelExists, mapDeploymentRecordListItem, resolvePersonnelServiceStatusId } from '../../../shared/utils'
import { parseCreateDeploymentRecordFromDeploymentPayload, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { createDeploymentRecord } from '../../../utils/deployment-records/createDeploymentRecord'
import { deleteDeploymentRecordByRecordNo } from '../../../utils/deployment-records/deleteDeploymentRecordByRecordNo'
import { getDeploymentRecordById } from '../../../utils/deployment-records/getDeploymentRecordById'
import { getDeploymentSourceById } from '../../../utils/deployment-records/getDeploymentSourceById'
import { getPersonnelServiceStatusById } from '../../../utils/deployments/getPersonnelServiceStatusById'
import { getNextDeploymentRecordNo } from '../../../utils/deployment-records/getNextDeploymentRecordNo'
import { updatePersonnelServiceStatusById } from '../../../utils/deployments/updatePersonnelServiceStatusById'

export default defineEventHandler(async (event): Promise<CreateDeploymentRecordResponse> => {
  const actor = await requireAnyPermission(event, DEPLOYMENT_PERMISSION_GROUPS.deploymentManagement)
  const personnelId = requireRouteId(getRouterParam(event, PERSONNEL_ROUTE_PARAM_KEY), PERSONNEL_ROUTE_ID_REQUIRED_MESSAGE)
  const body = await readBody<CreateDeploymentRecordFromDeploymentRequest>(event)
  const supabase = getServiceSupabaseClient()
  const requestData = withPersonnelId(body, personnelId)

})
