import { createError, defineEventHandler, getQuery } from 'h3'
import type { CompanySuggestionsResponse } from '../../shared/responses'
import { COMPANY_SUGGESTION_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapCompanySuggestionItem, parseUnitSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const SEARCHABLE_FIELDS = ['code', 'name'] as const

export default defineEventHandler(async (event): Promise<CompanySuggestionsResponse> => {
  await requireAnyPermission(event, UNIT_PERMISSION_GROUPS.companyManagement)

  const query = getQuery(event)
  const { battalionId, pageSize, selectedId, term } = parseUnitSuggestionQuery({
    term: query.term,
    pageSize: query.pageSize,
    selectedId: query.selectedId,
    battalionId: query.battalionId,
  })

  const supabase = getServiceSupabaseClient()
  let companyQuery = supabase
    .from('companies')
    .select(COMPANY_SUGGESTION_SELECT_COLUMNS)
    .eq('is_active', true)
    .order('name', { ascending: true })
    .limit(pageSize)

  if (battalionId) {
    companyQuery = companyQuery.eq('battalion_id', battalionId)
  }

  if (term.length > 0) {
    const filters = SEARCHABLE_FIELDS.map((field) => `${field}.ilike.%${term}%`)

    if (filters.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
    }

    companyQuery = companyQuery.or(filters.join(','))
  }

  const { data, error } = await companyQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch company suggestions: ${error.message}` })
  }

  const mergedRows = [...(data ?? [])]

  if (selectedId && !mergedRows.some(row => row.id === selectedId)) {
    const { data: selectedRow, error: selectedError } = await supabase
      .from('companies')
      .select(COMPANY_SUGGESTION_SELECT_COLUMNS)
      .eq('id', selectedId)
      .maybeSingle()

    if (selectedError) {
      throw createError({ statusCode: 500, statusMessage: `Failed to fetch selected company suggestion: ${selectedError.message}` })
    }

    if (selectedRow) {
      mergedRows.unshift(selectedRow)
    }
  }

  return {
    items: mergedRows.map(mapCompanySuggestionItem),
  }
})
