export interface DeploymentRecordListItem {
  id: string
  recordNo: string
  personnelId: string
  personnelCode: string | null
  personnelName: string | null
  deploymentArea: string
  deploymentAreaLatitude: number | null
  deploymentAreaLongitude: number | null
  assignmentRole: string | null
  operationName: string | null
  startDate: string
  endDate: string | null
  statusId: string
  statusName: string | null
  location: string | null
  supervisorId: string | null
  supervisorName: string | null
  remarks: string | null
  createdAt: string
  updatedAt: string
}

export interface DeploymentSuggestionItem {
  id: string
  recordNo: string
  deploymentArea: string
  operationName: string | null
  location: string | null
  statusName: string | null
  startDate: string
  endDate: string | null
}

export interface DeploymentRecordReferenceRow {
  id: string
  name?: string
  personnel_code?: string
  full_name?: string
  last_name?: string
  first_name?: string
  middle_name?: string | null
}

export interface DeploymentSuggestionRow {
  id: string
  record_no: string
  deployment_area: string
  operation_name: string | null
  location: string | null
  start_date: string
  end_date: string | null
  deployment_status: DeploymentRecordReferenceRow | DeploymentRecordReferenceRow[] | null
}

export interface DeploymentSelectRow {
  id: string
  record_no: string
  deployment_area: string
  operation_name: string | null
  start_date: string
  end_date: string | null
  deployment_status: DeploymentRecordReferenceRow | DeploymentRecordReferenceRow[] | null
}

export interface DeploymentRecordSelectRow {
  id: string
  record_no: string
  personnel_id: string
  deployment_id?: string | null
  deployment_area: string
  operation_name: string | null
  assignment_role: string | null
  start_date: string
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface DeploymentRecordRow {
  id: string
  record_no: string
  personnel_id: string
  deployment_id: string | null
  deployment_area_latitude: number | null
  deployment_area_longitude: number | null
  deployment_area: string
  assignment_role: string | null
  operation_name: string | null
  start_date: string
  end_date: string | null
  status_id: string
  location: string | null
  supervisor_id: string | null
  remarks: string | null
  created_at: string
  updated_at: string
  personnel: DeploymentRecordReferenceRow | DeploymentRecordReferenceRow[] | null
  supervisor: DeploymentRecordReferenceRow | DeploymentRecordReferenceRow[] | null
  deployment_status: DeploymentRecordReferenceRow | DeploymentRecordReferenceRow[] | null
}

export interface DeploymentRow {
  id: string
  deployment_area: string
  deployment_area_latitude: number | null
  deployment_area_longitude: number | null
  assignment_role: string | null
  operation_name: string | null
  start_date: string
  end_date: string | null
  status_id: string
  location: string | null
  supervisor_id: string | null
  default_remarks: string | null
}
