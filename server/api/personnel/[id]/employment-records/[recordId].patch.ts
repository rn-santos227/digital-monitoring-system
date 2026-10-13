import { defineEventHandler } from 'h3'
import { PERMISSION_CODES } from '../../../../shared/constants'
import { requirePermission } from '../../../../utils/auth/requirePermission'
import { mutatePersonnelHistory } from '../../../../utils/personnel-history/mutatePersonnelHistory'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.personnelUpdate)
  return await mutatePersonnelHistory(event, 'employment', 'update', actor.id)
})
