import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { EngagementRecordDetailResponse } from '../../../shared/responses'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapEngagementRecordListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validation'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getEngagementRecordById } from '../../../utils/engagement-records/getEngagementRecordById'

const REQUIRED_PERMISSION_CODE = PERMISSION_CODES.engagementManage

export default defineEventHandler(async (event): Promise<EngagementRecordDetailResponse> => {
  await requirePermission(event, REQUIRED_PERMISSION_CODE)

  const id = requireRouteId(getRouterParam(event, 'id'), 'Engagement record id is required.')
  const engagementRecord = await getEngagementRecordById(getServiceSupabaseClient(), id)

  if (!engagementRecord) throw createError({ statusCode: 404, statusMessage: 'Engagement record not found.' })
  return mapEngagementRecordListItem(engagementRecord)
})
