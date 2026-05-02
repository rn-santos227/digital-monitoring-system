import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { DeploymentRecordDetailResponse } from '../../../shared/responses'
import { DEPLOYMENT_RECORD_DETAIL_SELECT_COLUMNS, PERMISSION_CODES } from '../../../shared/constants'
import { mapDeploymentRecordListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

export default defineEventHandler(async (event): Promise<DeploymentRecordDetailResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentManage)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Deployment record id is required.')
  const supabase = getServiceSupabaseClient()
  const { data, error } = await supabase
    .from('deployment_records')
    .select(DEPLOYMENT_RECORD_DETAIL_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch deployment record details: ${error.message}` })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Deployment record not found.' })
  }

  return mapDeploymentRecordListItem(data)
})
