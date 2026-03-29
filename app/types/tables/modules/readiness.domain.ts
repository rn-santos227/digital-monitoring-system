import type { AuditColumns, AuditInsert, ISODate, UUID } from '../shared'

export type PersonnelQualificationsRow = AuditColumns & {
  id: UUID
  personnel_id: UUID
  qualification_type: string
  date_obtained: ISODate | null
  valid_until: ISODate | null
}
export type PersonnelQualificationsInsert = AuditInsert & Omit<PersonnelQualificationsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type PersonnelQualificationsUpdate = Partial<PersonnelQualificationsInsert>


