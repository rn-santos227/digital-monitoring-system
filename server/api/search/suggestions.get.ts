import { createError, defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { GlobalSearchSuggestionResponse } from '../../shared/responses'
import { parseGlobalSearchSuggestionQuery } from '../../shared/validations'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchGlobalSearchSuggestions } from '../../utils/global-search/fetchGlobalSearchSuggestions'

export default defineEventHandler(async (event): Promise<GlobalSearchSuggestionResponse> => {
  const user = await requireAnyPermission(event, [
    PERMISSION_CODES.personnelView,
    PERMISSION_CODES.equipmentView,
  ])
  const { term } = parseGlobalSearchSuggestionQuery(getQuery(event))

  try {
    const items = await fetchGlobalSearchSuggestions(getServiceSupabaseClient(), user, term)
    return { items }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to fetch search suggestions.'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
