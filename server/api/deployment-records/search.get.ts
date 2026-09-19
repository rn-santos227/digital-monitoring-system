import { defineEventHandler, getQuery } from 'h3'
import type { DeploymentRecordListResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapDeploymentRecordListItem } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { parseDeploymentRecordSearchQuery } from '../../utils/deployment-records/parseDeploymentRecordSearchQuery'
import { searchDeploymentRecords } from '../../utils/deployment-records/searchDeploymentRecords'

export default defineEventHandler(async (event): Promise<DeploymentRecordListResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentManage)

  const { page, pageSize, ...searchParams } = parseDeploymentRecordSearchQuery(getQuery(event))
  const { rows, totalItems } = await searchDeploymentRecords(getServiceSupabaseClient(), searchParams)

  return {
    items: rows.map(mapDeploymentRecordListItem),
    page,
    pageSize,
    totalItems,
    totalPages: totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize),
  }
})
