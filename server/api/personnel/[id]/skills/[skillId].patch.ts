import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { PERMISSION_CODES } from '../../../../shared/constants'
import type { SavePersonnelSkillResponse } from '../../../../shared/responses'
import { mapPersonnelSkill } from '../../../../shared/utils'
import { parsePersonnelSkillPayload, requireRouteId } from '../../../../shared/validation'
import { requirePermission } from '../../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../../utils/auth/serviceClient'
import { assertPersonnelSkillTraining } from '../../../../utils/personnel-skills/assertPersonnelSkillTraining'
import { getPersonnelSkillById } from '../../../../utils/personnel-skills/getPersonnelSkillById'
import { updatePersonnelSkill } from '../../../../utils/personnel-skills/updatePersonnelSkill'
import { recordPersonnelSkillAudit } from '../../../../utils/personnel-skills/recordPersonnelSkillAudit'

export default defineEventHandler(async (event): Promise<SavePersonnelSkillResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.personnelUpdate)
  let personnelId: string | null = null
  let skillId: string | null = null
  let requestData: object | null = null
  let oldData: object | null = null
  try {
    personnelId = requireRouteId(getRouterParam(event, 'id'), 'Personnel id is required.')
    skillId = requireRouteId(getRouterParam(event, 'skillId'), 'Skill id is required.')
    const body: unknown = await readBody(event)
    requestData = body && typeof body === 'object' && !Array.isArray(body) ? body : null
    const payload = parsePersonnelSkillPayload(body)
    const supabase = getServiceSupabaseClient()
    oldData = mapPersonnelSkill(await getPersonnelSkillById(supabase, personnelId, skillId))
    await assertPersonnelSkillTraining(supabase, personnelId, payload.training_record_id)
    const item = await updatePersonnelSkill(supabase, personnelId, skillId, payload)
    await recordPersonnelSkillAudit(event, {
      userId: actor.id, action: 'update', outcome: 'success', personnelId,
      recordId: skillId, requestData, oldData, newData: item,
    })
    return { ok: true, id: item.id, item }
  } catch (error) {
    await recordPersonnelSkillAudit(event, {
      userId: actor.id, action: 'update', outcome: 'failed', personnelId,
      recordId: skillId, requestData, oldData, error,
    })
    throw error
  }
})
