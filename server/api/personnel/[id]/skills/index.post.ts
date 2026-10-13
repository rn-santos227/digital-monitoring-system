import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { ID_ONLY_SELECT_COLUMNS, PERMISSION_CODES } from '../../../../shared/constants'
import type { SavePersonnelSkillResponse } from '../../../../shared/responses'
import { assertPersonnelExists } from '../../../../shared/utils'
import { parsePersonnelSkillPayload, requireRouteId } from '../../../../shared/validation'
import { requirePermission } from '../../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../../utils/auth/serviceClient'
import { assertPersonnelSkillTraining } from '../../../../utils/personnel-skills/assertPersonnelSkillTraining'
import { createPersonnelSkill } from '../../../../utils/personnel-skills/createPersonnelSkill'
import { recordPersonnelSkillAudit } from '../../../../utils/personnel-skills/recordPersonnelSkillAudit'

export default defineEventHandler(async (event): Promise<SavePersonnelSkillResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.personnelUpdate)
  let personnelId: string | null = null
  let requestData: object | null = null
  try {
    personnelId = requireRouteId(getRouterParam(event, 'id'), 'Personnel id is required.')
    const body: unknown = await readBody(event)
    requestData = body && typeof body === 'object' && !Array.isArray(body) ? body : null
    const payload = parsePersonnelSkillPayload(body)
    const supabase = getServiceSupabaseClient()
    await assertPersonnelExists({ supabase, personnelId, idSelectColumns: ID_ONLY_SELECT_COLUMNS })
    await assertPersonnelSkillTraining(supabase, personnelId, payload.training_record_id)
    const item = await createPersonnelSkill(supabase, personnelId, payload)
    await recordPersonnelSkillAudit(event, {
      userId: actor.id, action: 'create', outcome: 'success', personnelId,
      recordId: item.id, requestData, newData: item,
    })
    return { ok: true, id: item.id, item }
  } catch (error) {
    await recordPersonnelSkillAudit(event, { userId: actor.id, action: 'create', outcome: 'failed', personnelId, requestData, error })
    throw error
  }
})
