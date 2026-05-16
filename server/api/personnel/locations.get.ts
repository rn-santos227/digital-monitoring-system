import { defineEventHandler } from 'h3'
import type { PersonnelDeploymentLocationsResponse } from '../../shared/responses'
import { PERSONNEL_DEPLOYMENT_LOCATION_SELECT_COLUMNS, PERSONNEL_PERMISSION_GROUPS } from '../../shared/constants'
import { mapPersonnelDeploymentLocationItem } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchPersonnelDeploymentLocations } from '../../utils/personnel/fetchPersonnelDeploymentLocations'

export default defineEventHandler(async (event): Promise<PersonnelDeploymentLocationsResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)

  const supabase = getServiceSupabaseClient()
  const rows = await fetchPersonnelDeploymentLocations(supabase, PERSONNEL_DEPLOYMENT_LOCATION_SELECT_COLUMNS)

  return {
    items: rows.map(mapPersonnelDeploymentLocationItem),
  }
})
