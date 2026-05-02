export interface CreateDeploymentRecordRequest {
  personnelId?: string
  deploymentId?: string | null
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
  supervisorPersonnelId?: string | null
  remarks?: string | null
}

export interface CreateDeploymentRecordFromDeploymentRequest {
  personnelId?: string
  deploymentId?: string
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
  supervisorPersonnelId?: string | null
  remarks?: string | null
}
