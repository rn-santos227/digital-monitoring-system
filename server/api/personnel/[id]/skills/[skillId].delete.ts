import { defineEventHandler, getRouterParam } from 'h3'
import { PERMISSION_CODES } from '../../../../shared/constants'
import type { MutationSuccessResponse } from '../../../../shared/responses'
import { mapPersonnelSkill } from '../../../../shared/utils'
import { requireRouteId } from '../../../../shared/validation'
import { requirePermission } from '../../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../../utils/auth/serviceClient'
import { getPersonnelSkillById } from '../../../../utils/personnel-skills/getPersonnelSkillById'
import { deletePersonnelSkill } from '../../../../utils/personnel-skills/deletePersonnelSkill'
import { recordPersonnelSkillAudit } from '../../../../utils/personnel-skills/recordPersonnelSkillAudit'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.personnelUpdate)
  let personnelId: string | null = null
  let skillId: string | null = null
  let oldData: object | null = null
  try {
    personnelId = requireRouteId(getRouterParam(event, 'id'), 'Personnel id is required.')
    skillId = requireRouteId(getRouterParam(event, 'skillId'), 'Skill id is required.')
    const supabase = getServiceSupabaseClient()
    // The owner-scoped read prevents deleting another person's qualification.
    oldData = mapPersonnelSkill(await getPersonnelSkillById(supabase, personnelId, skillId))
    await deletePersonnelSkill(supabase, personnelId, skillId)
    await recordPersonnelSkillAudit(event, {
      userId: actor.id, action: 'delete', outcome: 'success', personnelId, recordId: skillId, oldData,
    })
    return { ok: true }
  } catch (error) {
    await recordPersonnelSkillAudit(event, {
      userId: actor.id, action: 'delete', outcome: 'failed', personnelId, recordId: skillId, oldData, error,
    })
    throw error
  }
})
