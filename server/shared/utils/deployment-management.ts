import { createError } from 'h3'
import { parseNumber } from './parsers'
import { UUID_PATTERN } from './regex'
import type {
  DeploymentRecordListItem,
  DeploymentRecordRow,
  DeploymentRecordSelectRow,
  DeploymentRow,
  DeploymentSuggestionItem,
  DeploymentSuggestionRow,
  PersonnelSearchFilter,
} from '../models'

export interface DeploymentSearchQuery {
  page?: unknown
  pageSize?: unknown
  term?: unknown
  fields?: unknown
  conditions?: unknown
  match?: unknown
  statusId?: unknown
  supervisorId?: unknown
}

export interface ParsedDeploymentSearchQuery {
  page: number
  pageSize: number
  filters: string[]
  advancedFilters: PersonnelSearchFilter[]
  match: 'any' | 'all'
  statusId: string | null
  supervisorId: unknown
  rangeFrom: number
  rangeTo: number
}

const toSingleReference = (value: DeploymentRecordRow['personnel'] | DeploymentRecordRow['supervisor'] | DeploymentRecordRow['deployment_status']) => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

const toPersonnelName = (reference: DeploymentRecordRow['personnel'] | DeploymentRecordRow['supervisor']): string | null => {
  const row = toSingleReference(reference)

  if (!row) {
    return null
  }

  const fullName = row.full_name?.trim() ?? ''

  if (fullName.length > 0) {
    return fullName
  }

  const lastName = row.last_name?.trim() ?? ''
  const firstName = row.first_name?.trim() ?? ''
  const middleName = row.middle_name?.trim() ?? ''
  const firstMiddle = [firstName, middleName].filter(part => part.length > 0).join(' ')
  const normalizedName = [lastName, firstMiddle].filter(part => part.length > 0).join(', ')

  return normalizedName.length > 0 ? normalizedName : null
}

export const mapDeploymentRecordListItem = (row: DeploymentRecordRow): DeploymentRecordListItem => {
  const personnel = toSingleReference(row.personnel)
  const supervisor = toSingleReference(row.supervisor)
  const deploymentStatus = toSingleReference(row.deployment_status)
  const recordNo = row.record_no ?? ""

  return {
    id: row.id,
    recordNo,
    personnelId: row.personnel_id,
    personnelCode: personnel?.personnel_code ?? null,
    personnelName: toPersonnelName(row.personnel),
    deploymentArea: row.deployment_area,
    deploymentAreaLatitude: row.deployment_area_latitude,
    deploymentAreaLongitude: row.deployment_area_longitude,
    assignmentRole: row.assignment_role,
    operationName: row.operation_name,
    startDate: row.start_date,
    endDate: row.end_date,
    statusId: row.status_id,
    statusName: deploymentStatus?.name ?? null,
    location: row.location,
    supervisorId: row.supervisor_id ?? supervisor?.id ?? null,
    supervisorName: toPersonnelName(row.supervisor),
    remarks: row.remarks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}


export const mapDeploymentDetailListItem = (row: DeploymentRow): DeploymentRecordListItem => {
  const deploymentStatus = toSingleReference(row.deployment_status)

  return {
    id: row.id,
    recordNo: '',
    personnelId: '',
    personnelCode: null,
    personnelName: null,
    deploymentArea: row.deployment_area,
    deploymentAreaLatitude: row.deployment_area_latitude,
    deploymentAreaLongitude: row.deployment_area_longitude,
    assignmentRole: row.assignment_role,
    operationName: row.operation_name,
    startDate: row.start_date,
    endDate: row.end_date,
    statusId: row.status_id,
    statusName: deploymentStatus?.name ?? null,
    location: row.location,
    supervisorId: row.supervisor_id,
    supervisorName: null,
    remarks: row.default_remarks,
    createdAt: '',
    updatedAt: '',
  }
}

export const mapDeploymentRecordSelectListItem = (row: DeploymentRecordSelectRow): DeploymentRecordListItem => {
  const recordNo = row.record_no ?? ""

  return {
    id: row.id,
    recordNo,
    personnelId: row.personnel_id,
    personnelCode: null,
    personnelName: null,
    deploymentArea: row.deployment_area,
    deploymentAreaLatitude: null,
    deploymentAreaLongitude: null,
    assignmentRole: row.assignment_role,
    operationName: row.operation_name,
    startDate: row.start_date,
    endDate: row.end_date,
    statusId: '',
    statusName: null,
    location: null,
    supervisorId: null,
    supervisorName: null,
    remarks: null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const parseDeploymentSuggestionQuery = (query: {
  term?: unknown
  pageSize?: unknown
  selectedId?: unknown
}) => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const selectedId = typeof query.selectedId === 'string' && query.selectedId.length > 0 ? query.selectedId : null
  const rawPageSize = Math.trunc(parseNumber(query.pageSize, 10))
  const pageSize = Math.min(Math.max(rawPageSize, 1), 20)

  return {
    term,
    pageSize,
    selectedId,
  }
}

export const mapDeploymentSelectListItem = (row: DeploymentSuggestionRow): DeploymentSuggestionItem => {
  const status = toSingleReference(row.deployment_status)

  return {
    id: row.id,
    deploymentArea: row.deployment_area,
    operationName: row.operation_name,
    location: row.location,
    statusName: status?.name ?? null,
    startDate: row.start_date,
    endDate: row.end_date,
  }
}

type DeploymentStatusLookupSupabaseClient = {
  from: (table: 'deployment_statuses') => {
    select: (columns: 'id') => {
      eq: (column: 'id' | 'name', value: string) => {
        maybeSingle: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>
      }
    }
  }
}

export const resolveDeploymentStatusId = async (supabase: unknown, value: string): Promise<string> => {
  const supabaseClient = supabase as DeploymentStatusLookupSupabaseClient
  const normalizedValue = value.trim()
  const filterField: 'id' | 'name' = UUID_PATTERN.test(normalizedValue) ? 'id' : 'name'

  const { data, error } = await supabaseClient
    .from('deployment_statuses')
    .select('id')
    .eq(filterField, normalizedValue)
    .maybeSingle()

  if (error || !data?.id) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid deployment status value.' })
  }

  return data.id
}
