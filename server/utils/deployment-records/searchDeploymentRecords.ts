import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DeploymentRecordRow, PersonnelSearchFilter } from '../../shared/models'
import { DEPLOYMENT_RECORD_DETAIL_SELECT_COLUMNS, DEPLOYMENT_RECORD_SEARCHABLE_FIELD_COLUMNS } from '../../shared/constants'
import { applyPersonnelSearchFilters } from '../../shared/utils'

interface SearchDeploymentRecordsParams {
  term: string
  fields: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  personnelId: string | null
  statusId: string | null
  supervisorId: string | null
  rangeFrom: number
  rangeTo: number
}

export function resolveDeploymentRecordSearchFilters(term: string, fields: string[]) {
  const selectedFields = fields.length > 0
    ? fields.filter((field): field is keyof typeof DEPLOYMENT_RECORD_SEARCHABLE_FIELD_COLUMNS => field in DEPLOYMENT_RECORD_SEARCHABLE_FIELD_COLUMNS)
    : Object.keys(DEPLOYMENT_RECORD_SEARCHABLE_FIELD_COLUMNS) as Array<keyof typeof DEPLOYMENT_RECORD_SEARCHABLE_FIELD_COLUMNS>

  const filters = term ? selectedFields.map(field => `${DEPLOYMENT_RECORD_SEARCHABLE_FIELD_COLUMNS[field]}.ilike.%${term}%`) : []

  if (term && filters.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No valid searchable fields were provided.' })
  }

  return filters
}

export async function searchDeploymentRecords(supabase: SupabaseClient, params: SearchDeploymentRecordsParams) {
  const { term, fields, personnelId, statusId, supervisorId, rangeFrom, rangeTo } = params
  const filters = resolveDeploymentRecordSearchFilters(term, fields)

  let query = supabase
    .from('deployment_records')
    .select(DEPLOYMENT_RECORD_DETAIL_SELECT_COLUMNS, { count: 'exact' })
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('deployment_area', { ascending: true })
    .range(rangeFrom, rangeTo)

  if (filters.length > 0) query = query.or(filters.join(','))
  if (params.advancedFilters.length > 0) {
    query = applyPersonnelSearchFilters(query, params.advancedFilters, params.match)
  }
  if (personnelId) query = query.eq('personnel_id', personnelId)
  if (statusId) query = query.eq('status_id', statusId)
  if (supervisorId) query = query.eq('supervisor_id', supervisorId)

  const { data, count, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search deployment records: ${error.message}` })
  }

  return {
    rows: (data ?? []) as DeploymentRecordRow[],
    totalItems: count ?? 0,
  }
}
