import type { AuditColumns, AuditInsert, ISODate, UUID } from '../shared'

export type DeploymentRecordsRow = AuditColumns & {
  id: UUID
  record_no: string
  personnel_id: UUID
  deployment_area: string
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
