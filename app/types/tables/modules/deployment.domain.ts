import type { AuditColumns, AuditInsert, ISODate, UUID } from '../shared'

export type DeploymentsRow = AuditColumns & {
  id: UUID
  deployment_area: string
  deployment_area_latitude: number | null
  deployment_area_longitude: number | null
  assignment_role: string | null
  operation_name: string | null
  start_date: ISODate
  end_date: ISODate | null
  status_id: UUID
  location: string | null
  supervisor_id: UUID | null
  default_remarks: string | null
}
export type DeploymentsInsert = AuditInsert & Omit<DeploymentsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type DeploymentsUpdate = Partial<DeploymentsInsert>

export type DeploymentRecordsRow = AuditColumns & {
  id: UUID
  record_no: string
  personnel_id: UUID
  deployment_id: UUID | null
  deployment_area: string
  deployment_area_latitude: number | null
  deployment_area_longitude: number | null
  assignment_role: string | null
  operation_name: string | null
  start_date: ISODate
  end_date: ISODate | null
  status_id: UUID
  location: string | null
  supervisor_id: UUID | null
  remarks: string | null
}
export type DeploymentRecordsInsert = AuditInsert & Omit<DeploymentRecordsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type DeploymentRecordsUpdate = Partial<DeploymentRecordsInsert>
