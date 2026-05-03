import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { DeploymentRecordDetailResponse } from '../../../shared/responses'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapDeploymentRecordListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getDeploymentRecordById } from '../../../utils/deployment-records/getDeploymentRecordById'

export default defineEventHandler(async (event): Promise<DeploymentRecordDetailResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentManage)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Deployment record id is required.')
  const supabase = getServiceSupabaseClient()
  const deploymentRecord = await getDeploymentRecordById(supabase, id)

 if (!deploymentRecord) {
    throw createError({ statusCode: 404, statusMessage: 'Deployment record not found.' })
  }

  return mapDeploymentRecordListItem(deploymentRecord)
})
