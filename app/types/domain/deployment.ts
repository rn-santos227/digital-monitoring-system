
export type DeploymentManagementTabId = 'deployments' | 'records'

import type {
  DeploymentRecordsInsert,
  DeploymentRecordsRow,
  DeploymentRecordsUpdate,
  UUID,
} from '../database.tables'

export type DeploymentRecordCreateInput = DeploymentRecordsInsert
export type DeploymentRecordUpdateInput = DeploymentRecordsUpdate

export interface CreateDeploymentPayload {
  deploymentArea: string
  deploymentAreaLatitude: number | null
  deploymentAreaLongitude: number | null
  assignmentRole: string | null
  operationName: string | null
  startDate: string
  endDate: string | null
  statusId: string
  location: string | null
  supervisorId: string | null
  remarks: string | null
}

export interface CreateDeploymentRecordPayload {
  personnel_id: string
  deployment_id: string
  assignment_role?: string | null
  deployment_area?: string
  start_date?: string
  end_date?: string | null
  remarks?: string | null
}

export interface UpdateDeploymentRecordPayload {
  deployment_area?: string
  assignment_role?: string | null
  operation_name?: string | null
  start_date?: string
  end_date?: string | null
  status_id?: string
  location?: string | null
  supervisor_id?: string | null
  remarks?: string | null
}

export interface DeploymentRecordSummary extends DeploymentRecordsRow {
  personnel_code: string
  full_name: string
  supervisor_name: string | null
  deployment_status: string
}

export interface DeploymentFilters {
  personnel_id?: UUID
  status_id?: UUID
  start_date_from?: string
  start_date_to?: string
  operation_name?: string
}

export interface DeploymentManagementSearchQuery {
  page?: number
  pageSize?: number
  term?: string
  fields?: string
}

export interface DeploymentManagementListItem {
  id: UUID
  operationName: string
  deploymentArea: string
  deploymentAreaLatitude: number | null
  deploymentAreaLongitude: number | null
  assignmentRole?: string | null
  startDate: string | null
  endDate: string | null
  statusName: string | null
  statusId?: string | null
  location?: string | null
  supervisorId?: string | null
  personnelName?: string | null
  recordNo?: string | null
  remarks?: string | null
  defaultRemarks?: string | null
  deploymentPersonnel?: ReadonlyArray<{
    id?: string | null
    personnelCode?: string | null
    fullName?: string | null
    rankName?: string | null
    serviceStatus?: string | null
  }>
}

export interface DeploymentManagementListResponse<TItem> {
  items: TItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface DeploymentTablePagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
