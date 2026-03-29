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

export type PersonnelMedicalReadinessRow = AuditColumns & {
  id: UUID
  personnel_id: UUID
  medical_status: string
  fit_for_deployment: boolean
  last_exam_date: ISODate | null
  next_exam_date: ISODate | null
}
export type PersonnelMedicalReadinessInsert = AuditInsert & Omit<PersonnelMedicalReadinessRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type PersonnelMedicalReadinessUpdate = Partial<PersonnelMedicalReadinessInsert>

export type PersonnelWeaponAssignmentsRow = AuditColumns & {
  id: UUID
  personnel_id: UUID
  equipment_asset_id: UUID
  assignment_date: ISODate
  relieved_date: ISODate | null
}
export type PersonnelWeaponAssignmentsInsert = AuditInsert & Omit<PersonnelWeaponAssignmentsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type PersonnelWeaponAssignmentsUpdate = Partial<PersonnelWeaponAssignmentsInsert>
