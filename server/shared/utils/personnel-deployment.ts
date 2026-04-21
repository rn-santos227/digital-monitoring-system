import type { PersonnelDeploymentRecordListRow } from '../models'
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
