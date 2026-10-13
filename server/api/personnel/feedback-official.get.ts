import { defineEventHandler } from 'h3'
import { PERSONNEL_FEEDBACK_CREATE_PERMISSION } from '../../shared/constants'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { getPersonnelFeedbackOfficial } from '../../utils/personnel-feedback/getPersonnelFeedbackOfficial'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERSONNEL_FEEDBACK_CREATE_PERMISSION)
  return await getPersonnelFeedbackOfficial(getServiceSupabaseClient(), actor.id)
})
