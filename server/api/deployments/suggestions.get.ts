import { defineEventHandler, getQuery } from 'h3'
import type { DeploymentSuggestionsResponse } from '../../shared/responses'
import { DEPLOYMENT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapDeploymentSelectListItem, parseDeploymentSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchDeploymentSuggestions } from '../../utils/deployments/fetchDeploymentSuggestions'

export default defineEventHandler(async (event): Promise<DeploymentSuggestionsResponse> => {
  await requireAnyPermission(event, DEPLOYMENT_PERMISSION_GROUPS.deploymentManagement)

  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseDeploymentSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
  })

  const supabase = getServiceSupabaseClient()
  const rows = await fetchDeploymentSuggestions(supabase, pageSize, term, selectedId)

  return { items: rows.map(mapDeploymentSelectListItem) }
})
