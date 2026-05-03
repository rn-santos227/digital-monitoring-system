import { defineEventHandler, getQuery } from 'h3'
import type { DeploymentSuggestionsResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { mapDeploymentSelectListItem, parseDeploymentSuggestionQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchDeploymentSuggestions } from '../../utils/deployments/fetchDeploymentSuggestions'
import { getDeploymentSuggestionById } from '../../utils/deployments/getDeploymentSuggestionById'

export default defineEventHandler(async (event): Promise<DeploymentSuggestionsResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentManage)

  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseDeploymentSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
  })

  const supabase = getServiceSupabaseClient()
  const rows = await fetchDeploymentSuggestions(supabase, pageSize, term)
  const mergedRows = [...rows]

  if (selectedId && !mergedRows.some(row => row.id === selectedId)) {
    const selectedRow = await getDeploymentSuggestionById(supabase, selectedId)
    if (selectedRow) {
      mergedRows.unshift(selectedRow)
    }
  }

  return {
    items: mergedRows.map(mapDeploymentSelectListItem),
  }
})
