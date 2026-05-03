import { defineEventHandler, getQuery } from 'h3'
import type { PrivilegeListResponse } from '../../shared/models'
import { MANAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchPrivilegeList } from '../../utils/privileges/fetchPrivilegeList'

export default defineEventHandler(async (event): Promise<PrivilegeListResponse> => {
  await requireAnyPermission(event, MANAGEMENT_PERMISSION_GROUPS.accountTypeManagement)

  const query = getQuery(event)
  const accountTypeId = typeof query.accountTypeId === 'string' ? query.accountTypeId.trim() : ''
  const supabase = getServiceSupabaseClient()

  return fetchPrivilegeList(supabase, accountTypeId)
})
