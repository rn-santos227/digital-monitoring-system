import { defineEventHandler } from 'h3'
import { UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import type { UnitManagementKpiApiResponse } from '../../shared/responses'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchUnitManagementCounts } from '../../utils/dashboard/fetchUnitManagementCounts'

const UNIT_MANAGEMENT_KPI_PERMISSION_CODES = [
  ...UNIT_PERMISSION_GROUPS.battalionManagement,
  ...UNIT_PERMISSION_GROUPS.companyManagement,
] as const

export default defineEventHandler(async (event): Promise<UnitManagementKpiApiResponse> => {
  await requireAnyPermission(event, UNIT_MANAGEMENT_KPI_PERMISSION_CODES)
  return await fetchUnitManagementCounts(getServiceSupabaseClient())
})
