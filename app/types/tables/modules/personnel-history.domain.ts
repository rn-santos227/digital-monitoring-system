import type { AuditColumns, AuditInsert, ISODate, UUID } from '../shared'

export type PersonnelEmploymentRecordsRow = AuditColumns & {
  id: UUID
  personnel_id: UUID
  employer_name: string
  job_title: string
  start_date: ISODate | null
  end_date: ISODate | null
  reference: string | null
  remarks: string | null
}
export type PersonnelEmploymentRecordsInsert = AuditInsert & Omit<PersonnelEmploymentRecordsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type PersonnelEmploymentRecordsUpdate = Partial<PersonnelEmploymentRecordsInsert>

export type PersonnelEducationRecordsRow = AuditColumns & {
  id: UUID
  personnel_id: UUID
  institution_name: string
  qualification_name: string
  education_level: string | null
  start_date: ISODate | null
  end_date: ISODate | null
  reference: string | null
  remarks: string | null
}
export type PersonnelEducationRecordsInsert = AuditInsert & Omit<PersonnelEducationRecordsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type PersonnelEducationRecordsUpdate = Partial<PersonnelEducationRecordsInsert>
