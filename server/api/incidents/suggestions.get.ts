import { defineEventHandler, getQuery } from 'h3'
import type { InvestigationStatusSuggestionResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchInvestigationStatusSuggestions } from '../../utils/incidents/fetchInvestigationStatusSuggestions'

export default defineEventHandler(async (event): Promise<InvestigationStatusSuggestionResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''
})
