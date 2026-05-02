import { parseNumber } from './parsers'
import type {
  DeploymentRecordListItem,
  DeploymentRecordRow,
  DeploymentRecordSelectRow,
  DeploymentSuggestionItem,
  DeploymentSuggestionRow,
} from '../models'

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

  return {
    id: row.id,
    recordNo: row.record_no,
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

export const mapDeploymentRecordSelectListItem = (row: DeploymentRecordSelectRow): DeploymentRecordListItem => {
  return {
    id: row.id,
    recordNo: row.record_no,
    personnelId: row.personnel_id,
    personnelCode: null,
    personnelName: null,
    deploymentArea: row.deployment_area,
    deploymentAreaLatitude: null,
    deploymentAreaLongitude: null,
    assignmentRole: row.assignmentRole,
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

export const mapDeploymentSuggestionItem = (row: DeploymentSuggestionRow): DeploymentSuggestionItem => {
  const status = toSingleReference(row.deployment_status)

  return {
    id: row.id,
    recordNo: row.record_no,
    deploymentArea: row.deployment_area,
    operationName: row.operation_name,
    location: row.location,
    statusName: status?.name ?? null,
    startDate: row.start_date,
    endDate: row.end_date,
  }
}

export const buildDeploymentRecordNo = (): string => {
  const timestamp = new Date().toISOString().replaceAll(/[^0-9]/g, '').slice(0, 14)
  const suffix = crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()

  return `DR-${timestamp}-${suffix}`
}
