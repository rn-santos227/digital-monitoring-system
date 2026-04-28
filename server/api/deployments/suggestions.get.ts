import { createError, defineEventHandler, getQuery } from 'h3'
import type { DeploymentSuggestionsResponse } from '../../shared/responses'
import { DEPLOYMENT_SUGGESTION_SELECT_COLUMNS, PERMISSION_CODES } from '../../shared/constants'
import { mapDeploymentSuggestionItem, parseDeploymentSuggestionQuery } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_FIELDS = ['record_no', 'deployment_area', 'operation_name', 'location'] as const

export default defineEventHandler(async (event): Promise<DeploymentSuggestionsResponse> => {
  await requirePermission(event, PERMISSION_CODES.deploymentManage)

  const query = getQuery(event)
  const { pageSize, selectedId, term } = parseDeploymentSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
  })

  const supabase = getServiceSupabaseClient()
  let deploymentQuery = supabase
    .from('deployment_records')
    .select(DEPLOYMENT_SUGGESTION_SELECT_COLUMNS)
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('deployment_area', { ascending: true })
    .limit(pageSize)

  if (term.length > 0) {
    const filters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)

    if (filters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
    }

    deploymentQuery = deploymentQuery.or(filters.join(','))
  }

  const { data, error } = await deploymentQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch deployment suggestions: ${error.message}` })
  }

  const mergedRows = [...(data ?? [])]

  if (selectedId && !mergedRows.some(row => row.id === selectedId)) {
    const { data: selectedRow, error: selectedError } = await supabase
      .from('deployment_records')
      .select(DEPLOYMENT_SUGGESTION_SELECT_COLUMNS)
      .eq('id', selectedId)
      .maybeSingle()

    if (selectedError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to fetch selected deployment record: ${selectedError.message}` })
    }

    if (selectedRow) {
      mergedRows.unshift(selectedRow)
    }
  }

  return {
    items: mergedRows.map(mapDeploymentSuggestionItem),
  }
})
