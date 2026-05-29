import { defineEventHandler } from 'h3'
import { MANAGEMENT_PERMISSION_GROUPS } from '../../shared/constants'
import type { UserManagementKpiApiResponse } from '../../shared/responses'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchUserManagementKpiCounts } from '../../utils/users/fetchUserManagementKpiCounts'

const USER_MANAGEMENT_KPI_PERMISSION_CODES = [
  ...MANAGEMENT_PERMISSION_GROUPS.userProfileManagement,
  ...MANAGEMENT_PERMISSION_GROUPS.accountTypeManagement,
] as const

export default defineEventHandler(async (event): Promise<UserManagementKpiApiResponse> => {
  await requireAnyPermission(event, USER_MANAGEMENT_KPI_PERMISSION_CODES)
  return await fetchUserManagementKpiCounts(getServiceSupabaseClient())
})
