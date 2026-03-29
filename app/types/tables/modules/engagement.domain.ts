import type { AuditColumns, AuditInsert, ISODate, UUID } from '../shared'

export type EngagementRecordsRow = AuditColumns & {
  id: UUID
  record_no: string
  personnel_id: UUID
  engagement_title: string
  engagement_type_id: UUID
  level_id: UUID | null
  date_start: ISODate | null
  date_end: ISODate | null
  status_id: UUID
  remarks: string | null
}
export type EngagementRecordsInsert = AuditInsert & Omit<EngagementRecordsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type EngagementRecordsUpdate = Partial<EngagementRecordsInsert>
