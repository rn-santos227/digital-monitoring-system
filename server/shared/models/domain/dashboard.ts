export interface DashboardPersonName {
  first_name: string
  last_name: string
}

export interface DashboardDeploymentStatus {
  name: string
}

export interface DeploymentHistoryRow {
  created_at: string
  location: string | null
  deployment_area: string | null
  personnel_id: string
  deployment_statuses: DashboardDeploymentStatus | DashboardDeploymentStatus[] | null
  personnel: DashboardPersonName | DashboardPersonName[] | null
}

export interface NearRotationDeploymentRow {
  personnel_id: string
  end_date: string
  location: string | null
  deployment_area: string | null
  personnel: DashboardPersonName | DashboardPersonName[] | null
}
