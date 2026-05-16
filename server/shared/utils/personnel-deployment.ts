import type { PersonnelDeploymentLocationItem, PersonnelDeploymentLocationRow, PersonnelDeploymentRecordListRow } from '../models'
import type { PersonnelDeploymentRecordListItem } from '../responses'

const toSingleLinkedReference = (value: { name?: string | null } | { name?: string | null }[] | null) => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export const mapPersonnelDeploymentRecordListItem = (
  row: PersonnelDeploymentRecordListRow,
): PersonnelDeploymentRecordListItem => {
  const status = toSingleLinkedReference(row.deployment_status)

  return {
    id: row.id,
    deploymentArea: row.deployment_area,
    operationName: row.operation_name,
    location: row.location,
    assignmentRole: row.assignment_role,
    status: status?.name ?? 'Unknown',
    startDate: row.start_date,
    endDate: row.end_date,
  }
}

const toCompactLocationPersonnelName = (
  value: PersonnelDeploymentLocationRow['personnel'],
): string | null => {
  if (!value) {
    return null
  }

  const row = Array.isArray(value) ? (value[0] ?? null) : value
  if (!row) {
    return null
  }

  const fullName = row.full_name?.trim() ?? ''
  if (fullName.length > 0) {
    return fullName
  }

  const firstName = row.first_name?.trim() ?? ''
  const middleName = row.middle_name?.trim() ?? ''
  const lastName = row.last_name?.trim() ?? ''
  const middleInitial = middleName.length > 0 ? `${middleName[0] ?? ''}.` : ''
  const givenNames = [firstName, middleInitial].filter(part => part.length > 0).join(' ')
  const fallbackName = [givenNames, lastName].filter(part => part.length > 0).join(' ')

  return fallbackName.length > 0 ? fallbackName : null
}

export const mapPersonnelDeploymentLocationItem = (
  row: PersonnelDeploymentLocationRow,
): PersonnelDeploymentLocationItem => ({
  personnelId: row.personnel_id,
  personnelName: toCompactLocationPersonnelName(row.personnel),
  operationName: row.operation_name,
  deploymentArea: row.deployment_area,
  latitude: row.deployment_area_latitude,
  longitude: row.deployment_area_longitude,
})
