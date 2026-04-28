export interface CreateDeploymentRecordRequest {
  personnelId?: string
  deploymentArea?: string
  deploymentAreaLatitude?: number | null
  deploymentAreaLongitude?: number | null
  assignmentRole?: string | null
  operationName?: string | null
  startDate?: string
  endDate?: string | null
  statusId?: string
  location?: string | null
  supervisorId?: string | null
  remarks?: string | null
}

export interface UpdateDeploymentRecordRequest {
  personnelId?: string
  deploymentArea?: string
  deploymentAreaLatitude?: number | null
  deploymentAreaLongitude?: number | null
  assignmentRole?: string | null
  operationName?: string | null
  startDate?: string
  endDate?: string | null
  statusId?: string
  location?: string | null
  supervisorId?: string | null
  remarks?: string | null
}
