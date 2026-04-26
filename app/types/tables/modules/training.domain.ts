import type { AuditColumns, AuditInsert, ISODate, UUID } from '../shared'

export type TrainingsRow = AuditColumns & {
  id: UUID
  training_title: string
  training_category_id: UUID | null
  level_id: UUID | null
  start_date: ISODate | null
  end_date: ISODate | null
  status_id: UUID
  default_remarks: string | null
}
export type TrainingsInsert = AuditInsert & Omit<TrainingsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type TrainingsUpdate = Partial<TrainingsInsert>

export type TrainingRecordsRow = AuditColumns & {
  id: UUID
  record_no: string
  personnel_id: UUID
  training_id: UUID | null
  training_title: string
  training_category_id: UUID | null
  level_id: UUID | null
  start_date: ISODate | null
  end_date: ISODate | null
  status_id: UUID
  certificate_no: string | null
  valid_until: ISODate | null
  remarks: string | null
}
export type TrainingRecordsInsert = AuditInsert & Omit<TrainingRecordsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type TrainingRecordsUpdate = Partial<TrainingRecordsInsert>
