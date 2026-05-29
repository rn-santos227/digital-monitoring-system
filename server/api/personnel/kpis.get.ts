import { defineEventHandler } from 'h3'
import { PERSONNEL_PERMISSION_GROUPS } from '../../shared/constants'
import type { PersonnelKpiApiResponse } from '../../shared/responses'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchPersonnelKpiCounts } from '../../utils/personnel/fetchPersonnelKpiCounts'

export default defineEventHandler(async (event): Promise<PersonnelKpiApiResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)
  return await fetchPersonnelKpiCounts(getServiceSupabaseClient())
})
