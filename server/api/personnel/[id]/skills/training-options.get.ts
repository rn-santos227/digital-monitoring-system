import { defineEventHandler, getQuery, getRouterParam } from 'h3'
import { ID_ONLY_SELECT_COLUMNS, PERSONNEL_PERMISSION_GROUPS } from '../../../../shared/constants'
import type { PersonnelSkillTrainingOptionsResponse } from '../../../../shared/responses'
import { assertPersonnelExists } from '../../../../shared/utils'
import { parsePersonnelSkillTrainingOptionsQuery, requireRouteId } from '../../../../shared/validation'
import { requireAnyPermission } from '../../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../../utils/auth/serviceClient'
import { fetchPersonnelSkillTrainingOptions } from '../../../../utils/personnel-skills/fetchPersonnelSkillTrainingOptions'

export default defineEventHandler(async (event): Promise<PersonnelSkillTrainingOptionsResponse> => {
  await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)
  const personnelId = requireRouteId(getRouterParam(event, 'id'), 'Personnel id is required.')
  const { term, selectedId } = parsePersonnelSkillTrainingOptionsQuery(getQuery(event))
  const supabase = getServiceSupabaseClient()
  await assertPersonnelExists({ supabase, personnelId, idSelectColumns: ID_ONLY_SELECT_COLUMNS })
  return { items: await fetchPersonnelSkillTrainingOptions(supabase, personnelId, term, selectedId) }
})
