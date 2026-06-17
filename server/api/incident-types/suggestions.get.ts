import { defineEventHandler, getQuery } from 'h3'
import type { IncidentTypeSuggestionResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchIncidentTypeSuggestions } from '../../utils/incidents/fetchIncidentTypeSuggestions'


export default defineEventHandler(async (event): Promise<IncidentTypeSuggestionResponse> => {
  await requirePermission(event, PERMISSION_CODES.equipmentView)
  const query = getQuery(event)
  const term = typeof query.term === 'string' ? query.term.trim() : ''

  return {
    items: await fetchIncidentTypeSuggestions(getServiceSupabaseClient(), term),
  }
})
