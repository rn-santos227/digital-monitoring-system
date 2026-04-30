
export type DeploymentManagementTabId = 'deployments' | 'records'

import type {
  DeploymentsInsert,
  DeploymentRecordsInsert,
  DeploymentRecordsRow,
  DeploymentRecordsUpdate,
  UUID,
} from '../database.tables'

export type CreateDeploymentPayload = Pick<
  DeploymentsInsert,
  | 'deployment_area'
  | 'deployment_area_latitude'
  | 'deployment_area_longitude'
  | 'assignment_role'
  | 'operation_name'
  | 'start_date'
  | 'end_date'
  | 'status_id'
  | 'location'
  | 'supervisor_id'
  | 'default_remarks'
>

export type DeploymentRecordCreateInput = DeploymentRecordsInsert
export type DeploymentRecordUpdateInput = DeploymentRecordsUpdate

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
  status: string | null
  statusId?: string | null
  location?: string | null
  supervisorId?: string | null
  defaultRemarks?: string | null
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
